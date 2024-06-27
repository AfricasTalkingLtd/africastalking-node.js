'use strict'

const axios = require('axios')
const validate = require('validate.js')

const Common = require('./common')
const {
  phoneValidator
} = require('./utils')

class Insights {
  constructor (options) {
    this.options = options
  };

  checkSimSwapState (phoneNumbers) {
    const _self = this
    let validationError

    const constraints = {
      phoneNumbers: function (value) {
        if (validate.isEmpty(value)) {
          return {
            presence: {
              message: 'is required'
            }
          }
        }

        if (!validate.isArray(value) && !validate.isString(value)) {
          return {
            format: 'must be a string or an array strings (phone numbers)'
          }
        }

        if (validate.isString(value)) {
          if (!phoneValidator(value).isValid) {
            return {
              format: 'must be a valid phone number'
            }
          }
        }

        if (validate.isArray(value)) {
          const invalidPhoneNumbers = []
          value.forEach(function (phoneNumber) {
            if (!phoneValidator(phoneNumber).isValid) {
              invalidPhoneNumbers.push(phoneNumber)
            }
          })
          if (invalidPhoneNumbers.length > 0) {
            return {
              format: 'must NOT contain invalid phone number'
            }
          }
        }
        return null
      }
    }

    const error = validate({ phoneNumbers }, constraints)
    if (error) {
      let msg = ''
      for (const k in error) {
        msg += error[k] + '; '
      }
      validationError = new Error(msg)
    }

    return new Promise((resolve, reject) => {
      if (validationError) {
        return reject(validationError)
      }
      const config = {
        method: 'post',
        url: `${Common.INSIGHTS_URL}/v1/sim-swap`,
        headers: {
          apiKey: _self.options.apiKey,
          Accept: _self.options.format,
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          username: _self.options.username,
          phoneNumbers
        })
      }
      axios(config)
        .then(function (resp) {
          const results = resp.data
          if (!results || results.status !== 'Processed') {
            return reject(results || 'Unexpected error')
          };
          return resolve(results)
        })
        .catch(function (error) {
          return reject(error)
        })
    })
  }
};

module.exports = Insights
