const joi = require('@hapi/joi')
const _ = require('lodash')
const { phoneValidator } = require('./utils')

class ActionBuilder {
  constructor () {
    this.finalized = false
    this.xml = '<?xml version="1.0" encoding="UTF-8"?><Response>'

    this.buildAction = function (action) {
      const { tag, text, children, attributes } = action

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
    const params = _.cloneDeep(attributes)
    params.text = text

    let validationError

    const _validateParams = function () {
      const schema = joi.object({
        text: joi.string().required().messages({
          'string.base': 'text must be a string',
          'any.required': 'text is required'
        }),
        voice: joi.string().valid('man', 'woman').optional().messages({
          'any.only': 'invalid option'
        }),
        playBeep: joi.boolean().optional().messages({
          'boolean.base': 'invalid option'
        })
      })

      const { error } = schema.validate(params, { abortEarly: false })
      if (error) {
        validationError = new Error(error.details.map(detail => detail.message).join('; '))
      }
    }

    _validateParams()
    if (validationError) throw validationError

    const action = { tag: 'Say', text, attributes }
    this.buildAction(action)
    return this
  }

  play (url) {
    const attributes = { url }

    let validationError

    const _validateParams = function () {
      const schema = joi.object({
        url: joi.string().uri({ scheme: ['http', 'https'] }).required().messages({
          'string.uri': 'url must be a valid URI',
          'any.required': 'url is required'
        })
      })

      const { error } = schema.validate(attributes, { abortEarly: false })
      if (error) {
        validationError = new Error(error.details.map(detail => detail.message).join('; '))
      }
    }

    _validateParams()
    if (validationError) throw validationError

    const action = { tag: 'Play', attributes }
    this.buildAction(action)
    return this
  }

  getDigits (children, attributes = {}) {
    const params = { children: _.cloneDeep(children), attributes: _.cloneDeep(attributes) }

    let validationError

    const _validateParams = function () {
      const schema = joi.object({
        children: joi.object().custom((value, helpers) => {
          const possibleChildren = ['say', 'play']
          if (!value || !possibleChildren.includes(Object.keys(value)[0])) {
            return helpers.error('any.invalid', { message: 'digits has invalid child' })
          }
          return value
        }).required().messages({
          'any.required': 'children is required'
        }),
        attributes: joi.object({
          numDigits: joi.number().integer().optional().messages({
            'number.base': 'must be an integer'
          }),
          timeout: joi.number().optional().messages({
            'number.base': 'must be time in seconds'
          }),
          callbackUrl: joi.string().uri({ scheme: ['http', 'https'] }).optional().messages({
            'string.uri': 'callbackUrl must be valid'
          })
        }).optional()
      })

      const { error } = schema.validate(params, { abortEarly: false })
      if (error) {
        validationError = new Error(error.details.map(detail => detail.message).join('; '))
      }
    }

    _validateParams()
    if (validationError) throw validationError

    const action = { tag: 'GetDigits', children, attributes }
    this.buildAction(action)
    return this
  }

  dial (phoneNumbers, attributes = {}) {
    const params = _.cloneDeep(attributes)
    params.phoneNumbers = phoneNumbers

    let validationError

    const _validateParams = function () {
      const schema = joi.object({
        phoneNumbers: joi.string().required().messages({
          'any.required': 'phoneNumbers is required',
          'string.base': 'must be a string'
        }),
        record: joi.boolean().optional().messages({
          'boolean.base': 'invalid option'
        }),
        sequential: joi.boolean().optional().messages({
          'boolean.base': 'invalid option'
        }),
        callerId: joi.string().custom((value, helpers) => {
          if (!phoneValidator(value).isValid) {
            return helpers.error('any.invalid', { message: 'must not contain invalid phone number' })
          }
          return value
        }).optional(),
        ringBackTone: joi.string().uri({ scheme: ['http', 'https'] }).optional(),
        maxDuration: joi.number().optional().messages({
          'number.base': 'must be time in seconds'
        })
      })

      const { error } = schema.validate(params, { abortEarly: false })
      if (error) {
        validationError = new Error(error.details.map(detail => detail.message).join('; '))
      }
    }

    _validateParams()
    if (validationError) throw validationError

    const action = { tag: 'Dial', attributes: params }
    this.buildAction(action)
    return this
  }

  record (children, attributes = {}) {
    const params = { children: _.cloneDeep(children), attributes: _.cloneDeep(attributes) }

    let validationError

    const _validateParams = function () {
      const schema = joi.object({
        children: joi.object().custom((value, helpers) => {
          const possibleChildren = ['say', 'play']
          if (!value || !possibleChildren.includes(Object.keys(value)[0])) {
            return helpers.error('any.invalid', { message: 'digits has invalid child' })
          }
          return value
        }).required(),
        attributes: joi.object({
          maxLength: joi.number().optional().messages({
            'number.base': 'must be time in seconds'
          }),
          timeout: joi.number().optional().messages({
            'number.base': 'must be time in seconds'
          }),
          trimSilence: joi.boolean().optional().messages({
            'boolean.base': 'invalid option'
          }),
          playBeep: joi.boolean().optional().messages({
            'boolean.base': 'invalid option'
          }),
          callbackUrl: joi.string().uri({ scheme: ['http', 'https'] }).optional()
        }).optional()
      })

      const { error } = schema.validate(params, { abortEarly: false })
      if (error) {
        validationError = new Error(error.details.map(detail => detail.message).join('; '))
      }
    }

    _validateParams()
    if (validationError) throw validationError

    const action = { tag: 'Record', children, attributes }
    this.buildAction(action)
    return this
  }

  enqueue (attributes) {
    const params = _.cloneDeep(attributes)
    let validationError

    const _validateParams = function () {
      const schema = joi.object({
        holdMusic: joi.string().uri({ scheme: ['http', 'https'] }).optional()
      })

      const { error } = schema.validate(params, { abortEarly: false })
      if (error) {
        validationError = new Error(error.details.map(detail => detail.message).join('; '))
      }
    }

    _validateParams()
    if (validationError) throw validationError

    const action = { tag: 'Enqueue', attributes }
    this.buildAction(action)
    return this
  }

  dequeue (phoneNumber, attributes = {}) {
    const params = _.cloneDeep(attributes)
    params.phoneNumber = phoneNumber

    let validationError

    const _validateParams = function () {
      const schema = joi.object({
        phoneNumber: joi.string().custom((value, helpers) => {
          if (!phoneValidator(value).isValid) {
            return helpers.error('any.invalid', { message: 'must not contain invalid phone number' })
          }
          return value
        }).required().messages({
          'any.required': 'phoneNumber is required'
        })
      })

      const { error } = schema.validate(params, { abortEarly: false })
      if (error) {
        validationError = new Error(error.details.map(detail => detail.message).join('; '))
      }
    }

    _validateParams()
    if (validationError) throw validationError

    const action = { tag: 'Dequeue', attributes: params }
    this.buildAction(action)
    return this
  }

  redirect (text) {
    let validationError

    const _validateParams = function () {
      const schema = joi.object({
        text: joi.string().uri({ scheme: ['http', 'https'] }).required().messages({
          'string.uri': 'text must be a valid URL',
          'any.required': 'text is required'
        })
      })

      const { error } = schema.validate({ text }, { abortEarly: false })
      if (error) {
        validationError = new Error(error.details.map(detail => detail.message).join('; '))
      }
    }

    _validateParams()
    if (validationError) throw validationError

    const action = { tag: 'Redirect', text }
    this.buildAction(action)
    return this
  }

  conference () {
    const action = { tag: 'Conference' }
    this.buildAction(action)
    return this
  }

  reject () {
    const action = { tag: 'Reject' }
    this.buildAction(action)
    return this
  }
}

module.exports = ActionBuilder
