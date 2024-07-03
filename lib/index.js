'use strict'
const validate = require('validate.js')
const _ = require('lodash')

const Common = require('./common')

const Application = require('./application')
const Token = require('./token')
const SMS = require('./sms')
const USSD = require('./ussd')
const Airtime = require('./airtime')
const Voice = require('./voice')
const MobileData = require('./mobileData')
const Insights = require('./insights')

class AfricasTalking {
  constructor (options) {
    this.options = _.cloneDeep(options)

    validate.validators.isString = function (value, options, key, attributes) {
      return validate.isEmpty(value) || validate.isString(value) ? null : 'must be a string'
    }

    const constraints = {
      format: {
        inclusion: ['json', 'xml']
      },
      username: {
        presence: true,
        isString: true
      },
      apiKey: {
        presence: true,
        isString: true
      }
    }

    const error = validate(this.options, constraints)
    if (error) {
      throw error
    }

    switch (this.options.format) {
      case 'xml':
        this.options.format = 'application/xml'
        break
      case 'json': // Get json by default
      default:
        this.options.format = 'application/json'
    }

    const isSandbox = this.options.username.toLowerCase() === 'sandbox'
    if (isSandbox) {
      Common.enableSandbox()
    }
    this.USSD = USSD
    this.SMS = new SMS(this.options)
    this.TOKEN = new Token(this.options)
    this.VOICE = new Voice(this.options)
    this.AIRTIME = new Airtime(this.options)
    this.INSIGHTS = new Insights(this.options)
    this.MOBILE_DATA = new MobileData(this.options)
    this.APPLICATION = new Application(this.options)

    /* For backward compatibility */
    this.ACCOUNT = this.APPLICATION
    /* End */
  }
}

module.exports = function (options) {
  return new AfricasTalking(options)
}
