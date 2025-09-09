const Joi = require('joi')
const _ = require('lodash')

const playSchema = Joi.object().keys({
  url: Joi.string().uri({ scheme: 'https' }).required()
})

const saySchema = Joi.object().keys({
  text: Joi.string().required(),
  voice: Joi.string().optional(),
  playBeep: Joi.boolean().optional()
})

class ActionBuilder {
  constructor () {
    this.finalized = false
    this.xml = '<?xml version="1.0" encoding="UTF-8"?><Response>'

    this.buildAction = function (action) {
      const {
        tag,
        text,
        children,
        attributes
      } = action

      this.xml = this.xml.concat('<' + tag)

      if (attributes && Object.keys(attributes).length > 0) {
        Object.entries(attributes)
          .forEach(([key, value]) => {
            this.xml = this.xml.concat(` ${key}="${value}"`)
          })
      }

      if (children && Object.keys(children).length > 0) {
        this.xml = this.xml.concat('>')
        Object.entries(children)
          .forEach(([child, options]) => {
            switch (child) {
              case 'say':
                this.say(options.text, options.attributes)
                break
              case 'play':
                this.play(options.url)
                break
              case 'getDigits':
                this.getDigits(options.children, options.attributes)
                break
              case 'dial':
                this.dial(options.phoneNumbers, options.attributes)
                break
              case 'record':
                this.record(options.children, options.attributes)
                break
              case 'enqueue':
                this.enqueue(options.attributes)
                break
              case 'dequeue':
                this.dequeue(options.phoneNumber, options.attributes)
                break
              case 'redirect':
                this.redirect(options.text)
                break
              case 'conference':
                this.conference()
                break
              case 'reject':
                this.redirect()
                break
              default:
                throw new Error('Invalid child')
            }
          })
        this.xml = this.xml.concat(`</${tag}>`)
      } else {
        if (text) {
          this.xml = this.xml.concat(`>${text}</${tag}>`)
        } else {
          this.xml = this.xml.concat('/>')
        }
      }
    }
  }

  build () {
    if (this.finalized) throw new Error('This builder has been finalized by a call to build()')

    this.finalized = true
    this.xml = this.xml.concat('</Response>')
    return this.xml
  }

  say (text, attributes = {}) {
    const { error } = saySchema.required().validate({ ...attributes, text })

    if (error) {
      const msg = error.details.map(detail => detail.message).join(';')
      throw new Error(msg)
    }

    const action = {
      tag: 'Say',
      text,
      attributes
    }

    this.buildAction(action)
    return this
  }

  play (url) {
    const attributes = { url }

    const { error } = playSchema.required().validate(attributes)

    if (error) {
      const msg = error.details.map(detail => detail.message).join(';')
      throw new Error(msg)
    }

    const action = {
      tag: 'Play',
      attributes
    }

    this.buildAction(action)
    return this
  }

  getDigits (children, attributes = {}) {
    const params = {
      children: _.cloneDeep(children),
      attributes: _.cloneDeep(attributes)
    }

    const schema = Joi.object().keys({
      attributes: Joi.object().keys({
        finishOnKey: Joi.string().max(1).default('#'),
        numDigits: Joi.number().integer().positive(),
        timeout: Joi.number().integer().positive(),
        callbackUrl: Joi.string().uri({ scheme: 'https' })
      }).required(),

      children: Joi.object().keys({
        say: saySchema,
        play: playSchema
      })
        .nand('say', 'play')
        .required()
    }).required()

    const { error } = schema.validate(params)

    if (error) {
      const msg = error.details.map(detail => detail.message).join(';')
      throw new Error(msg)
    }

    const action = {
      tag: 'GetDigits',
      children,
      attributes
    }

    this.buildAction(action)
    return this
  }

  dial (phoneNumbers, attributes = {}) {
    const params = _.cloneDeep(attributes)
    params.phoneNumbers = phoneNumbers

    const schema = Joi.object().keys({
      callerId: Joi.string().optional(),
      phoneNumbers: Joi.string().required(),
      record: Joi.boolean().optional(),
      sequential: Joi.boolean().optional(),
      maxDuration: Joi.number().integer().positive(),
      ringBackTone: Joi.string().uri({ scheme: 'https' })
    }).required()

    const { error } = schema.validate(params)

    if (error) {
      const msg = error.details.map(detail => detail.message).join(';')
      throw new Error(msg)
    }

    const action = {
      tag: 'Dial',
      attributes: params
    }

    this.buildAction(action)
    return this
  }

  record (children, attributes = {}) {
    const params = {
      children: _.cloneDeep(children),
      attributes: _.cloneDeep(attributes)
    }

    const schema = Joi.object().keys({
      attributes: Joi.object().keys({
        finishOnKey: Joi.string().max(1).default('#'),
        maxLength: Joi.number().integer().positive(),
        timeout: Joi.number().integer().positive(),
        playBeep: Joi.boolean().optional(),
        trimSilence: Joi.boolean().optional(),
        callbackUrl: Joi.string().uri({ scheme: 'https' })
      }),

      children: Joi.object().keys({
        say: saySchema,
        play: playSchema
      })
        .nand('say', 'play')
        .required()
    }).required()

    const { error } = schema.validate(params)

    if (error) {
      const msg = error.details.map(detail => detail.message).join(';')
      throw new Error(msg)
    }

    const action = {
      tag: 'Record',
      children,
      attributes
    }

    this.buildAction(action)
    return this
  }

  enqueue (attributes) {
    const params = _.cloneDeep(attributes)

    const schema = Joi.object().keys({
      holdMusic: Joi.string().uri({ scheme: 'https' }),
      name: Joi.string()
    }).optional()

    const { error } = schema.validate(params)

    if (error) {
      const msg = error.details.map(detail => detail.message).join(';')
      throw new Error(msg)
    }

    const action = {
      tag: 'Enqueue',
      attributes
    }

    this.buildAction(action)
    return this
  }

  dequeue (phoneNumber, attributes = {}) {
    const params = _.cloneDeep(attributes)
    params.phoneNumber = phoneNumber

    const schema = Joi.object().keys({
      phoneNumber: Joi.string().required(),
      name: Joi.string().optional()
    }).required()

    const { error } = schema.validate(params)

    if (error) {
      const msg = error.details.map(detail => detail.message).join(';')
      throw new Error(msg)
    }

    const action = {
      tag: 'Dequeue',
      attributes: params
    }

    this.buildAction(action)
    return this
  }

  redirect (url) {
    const schema = Joi.object().keys({
      url: Joi.string().uri({ scheme: 'https' }).required()
    }).required()

    const { error } = schema.validate({ url })

    if (error) {
      const msg = error.details.map(detail => detail.message).join(';')
      throw new Error(msg)
    }

    const action = {
      tag: 'Redirect',
      text: url
    }

    this.buildAction(action)
    return this
  }

  conference () {
    const action = {
      tag: 'Conference'
    }

    this.buildAction(action)
    return this
  }

  reject () {
    const action = {
      tag: 'Reject'
    }

    this.buildAction(action)
    return this
  }
}

module.exports = ActionBuilder
