'use strict'

const axios = require('axios')
const joi = require('@hapi/joi')

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

    const schema = joi.alternatives().try(
      joi.string().custom((value, helpers) => {
        if (!phoneValidator(value).isValid) {
          return helpers.error('any.invalid')
        }
        return value
      }).messages({
        'any.invalid': 'must be a valid phone number',
        'string.base': 'must be a string or an array of strings (phone numbers)'
      }),
      joi.array().items(
        joi.string().custom((value, helpers) => {
          if (!phoneValidator(value).isValid) {
            return helpers.error('any.invalid')
          }
          return value
        }).messages({
          'any.invalid': 'must NOT contain invalid phone number',
          'string.base': 'each phone number must be a string'
        })
      )
    )
      .required()
      .messages({
        'any.required': 'is required'
      })

    const { error } = schema.validate(phoneNumbers)

    if (error) {
      validationError = new Error(error.details.map(detail => detail.message).join('; '))
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
