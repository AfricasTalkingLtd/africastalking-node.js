const validate = require('validate.js')
const _ = require('lodash')
const { phoneValidator } = require('./utils')

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
    const params = _.cloneDeep(attributes)
    params.text = text

    let validationError

    const _validateParams = function () {
      const constraints = {
        text: function (value) {
          if (value && !validate.isString(value)) {
            return {
              format: 'text must be a string'
            }
          }
          return {
            presence: true
          }
        },
        voice: function (value) {
          const choices = ['man', 'woman']
          if (value && !choices.includes(value)) {
            return {
              format: 'invalid option'
            }
          }
          return null
        },
        playBeep: function (value) {
          if (!validate.isBoolean(value)) {
            return {
              format: 'invalid option'
            }
          }
          return null
        }
      }

      const error = validate(params, constraints)
      if (error) {
        let msg = ''
        for (const k in error) {
          msg += error[k] + '; '
        }

        validationError = new Error(msg)
      }
    }

    _validateParams()

    if (validationError) {
      throw validationError
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

    let validationError

    const _validateParams = function () {
      const constraints = {
        url: {
          presence: true,
          url: true
        }
      }

      const error = validate(attributes, constraints)
      if (error) {
        let msg = ''
        for (const k in error) {
          msg += error[k] + '; '
        }

        validationError = new Error(msg)
      }
    }

    _validateParams()

    if (validationError) {
      throw validationError
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

    let validationError

    const _validateParams = function () {
      const constraints = {
        children: function (value) {
          const possibleChildren = ['say', 'play']
          if (value && !possibleChildren.includes(Object.keys(value)[0])) {
            return {
              format: 'digits has invalid child'
            }
          }
          return {
            presence: true
          }
        },
        'attributes.numDigits': function (value) {
          if (!validate.isInteger(value)) {
            return {
              format: 'must be an integer'
            }
          }
        },
        'attributes.timeout': function (value) {
          if (!validate.isNumber(value)) {
            return {
              format: 'must be time in seconds'
            }
          }
        },
        'attributes.callbackUrl': {
          url: true
        }
      }

      const error = validate(params, constraints)
      if (error) {
        let msg = ''
        for (const k in error) {
          msg += error[k] + '; '
        }

        validationError = new Error(msg)
      }
    }

    _validateParams()

    if (validationError) {
      throw validationError
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

    let validationError

    const _validateParams = function () {
      const constraints = {
        phoneNumbers: function (value) {
          if (value && !validate.isString(value)) {
            return {
              format: 'must be a string'
            }
          }
          return {
            presence: true
          }
        },
        record: function (value) {
          if (!validate.isBoolean(value)) {
            return {
              format: 'invalid option'
            }
          }
          return null
        },
        sequential: function (value) {
          if (!validate.isBoolean(value)) {
            return {
              format: 'invalid option'
            }
          }
          return null
        },
        callerId: function (value) {
          if (!phoneValidator(value).isValid) {
            return {
              format: 'must not contain invalid phone number'
            }
          };
          return null
        },
        ringBackTone: {
          url: true
        },
        maxDuration: function (value) {
          if (!validate.isNumber(value)) {
            return {
              format: 'must be time in seconds'
            }
          }
        }
      }

      const error = validate(params, constraints)
      if (error) {
        let msg = ''
        for (const k in error) {
          msg += error[k] + '; '
        }

        validationError = new Error(msg)
      }
    }

    _validateParams()

    if (validationError) {
      throw validationError
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

    let validationError

    const _validateParams = function () {
      const constraints = {
        children: function (value) {
          const possibleChildren = ['say', 'play']
          if (value && !possibleChildren.includes(Object.keys(value)[0])) {
            return {
              format: 'digits has invalid child'
            }
          }
          return {
            presence: true
          }
        },
        'attributes.maxLength': function (value) {
          if (!validate.isNumber(value)) {
            return {
              format: 'must be time in seconds'
            }
          }
        },
        'attributes.timeout': function (value) {
          if (!validate.isNumber(value)) {
            return {
              format: 'must be time in seconds'
            }
          }
        },
        'attributes.trimSilence': function (value) {
          if (!validate.isBoolean(value)) {
            return {
              format: 'invalid option'
            }
          }
          return null
        },
        'attributes.playBeep': function (value) {
          if (!validate.isBoolean(value)) {
            return {
              format: 'invalid option'
            }
          }
          return null
        },
        'attributes.callbackUrl': {
          url: true
        }
      }

      const error = validate(params, constraints)
      if (error) {
        let msg = ''
        for (const k in error) {
          msg += error[k] + '; '
        }

        validationError = new Error(msg)
      }
    }

    _validateParams()

    if (validationError) {
      throw validationError
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

    let validationError

    const _validateParams = function () {
      const constraints = {
        holdMusic: {
          url: true
        }
      }

      const error = validate(params, constraints)
      if (error) {
        let msg = ''
        for (const k in error) {
          msg += error[k] + '; '
        }

        validationError = new Error(msg)
      }
    }

    _validateParams()

    if (validationError) {
      throw validationError
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

    let validationError

    const _validateParams = function () {
      const constraints = {
        phoneNumber: function (value) {
          if (value && !phoneValidator(value).isValid) {
            return {
              format: 'must not contain invalid phone number'
            }
          }
          return {
            presence: true
          }
        }
      }

      const error = validate(params, constraints)
      if (error) {
        let msg = ''
        for (const k in error) {
          msg += error[k] + '; '
        }

        validationError = new Error(msg)
      }
    }

    _validateParams()

    if (validationError) {
      throw validationError
    }

    const action = {
      tag: 'Dequeue',
      attributes: params
    }

    this.buildAction(action)
    return this
  }

  redirect (text) {
    let validationError

    const _validateParams = function () {
      const constraints = {
        text: function (value) {
          if (value && !validate.isEmpty(value)) {
            return {
              url: true
            }
          }
          return {
            presence: true
          }
        }
      }

      const error = validate({ text }, constraints)
      if (error) {
        let msg = ''
        for (const k in error) {
          msg += error[k] + '; '
        }

        validationError = new Error(msg)
      }
    }

    _validateParams()

    if (validationError) {
      throw validationError
    }

    const action = {
      tag: 'Redirect',
      text
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
