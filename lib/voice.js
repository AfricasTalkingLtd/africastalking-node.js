'use strict'
const Joi = require('joi')
const _ = require('lodash')
const axios = require('axios')

const Common = require('./common')
const Builder = require('./actionbuilder')

class Voice {
  constructor (options) {
    this.options = options
    this.ActionBuilder = Builder
  }

  call ({ callFrom, callTo, clientRequestId }) {
    return new Promise((resolve, reject) => {
      if (!callTo || !callFrom) {
        reject(new Error('Both "callTo" and "callFrom" are required'))
      };

      if (typeof callTo === 'string') {
        callTo = callTo.split(',')
      };

      if (!Array.isArray(callTo)) {
        reject(new Error('"callTo" can only be an array of phoneNumbers, or a string of comma-separated phoneNumbers'))
      };

      const schema = Joi.object({
        clientRequestId: Joi.string().optional(),
        callFrom: Joi.string()
          .custom((value, helpers) => {
            if (Common.phoneUtil.isValidNumber(value)) {
              return value
            }
            return helpers.error('any.invalid', { message: 'callFrom must be a valid phone number' })
          })
          .required(),
        callTo: Joi.array()
          .items(Joi.string().custom((value, helpers) => {
            if (Common.phoneUtil.isValidNumber(value)) {
              return value
            }
            return helpers.error('any.invalid', { message: `Invalid phone number: ${value}` })
          }))
          .min(1)
          .required()
      })

      const { error, value } = schema.validate({ callFrom, callTo, clientRequestId }, { abortEarly: false })

      if (error) {
        reject(error.details.map(detail => detail.message).join('; '))
      } else {
        const config = {
          method: 'post',
          url: `${Common.VOICE_URL}/call`,
          headers: {
            apikey: this.options.apiKey,
            Accept: this.options.format,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: new URLSearchParams({
            username: this.options.username,
            to: value.callTo.join(','),
            from: value.callFrom,
            clientRequestId: value.clientRequestId
          })
        }
        axios(config)
          .then(function (resp) {
            const httpStatus = resp.status

            if (httpStatus === 200 || httpStatus === 201) {
              // API returns CREATED on success
              resolve(resp.data)
            } else {
              reject(resp.data)
            };
          })
          .catch(function (error) {
            return reject(error)
          })
      };
    })
  }

  getNumQueuedCalls (params) {
    const options = _.cloneDeep(params)
    const _self = this

    // Validate params
    const _validateParams = function () {
      const schema = Joi.object({
        phoneNumbers: Joi.any()
          .custom((value, helpers) => {
            if (!value || (Array.isArray(value) && value.length === 0)) {
              return helpers.error('any.required', { message: 'phoneNumbers is required' })
            }
            return value
          })
          .required()
      })

      const { error } = schema.validate(options, { abortEarly: false })
      if (error) {
        throw new Error(error.details.map(detail => detail.message).join('; '))
      }
    }

    _validateParams()

    return new Promise(function (resolve, reject) {
      const config = {
        method: 'post',
        url: `${Common.VOICE_URL}/queueStatus`,
        headers: {
          apikey: _self.options.apiKey,
          Accept: _self.options.format
        },
        data: JSON.stringify({
          username: _self.options.username,
          phoneNumbers: options.phoneNumbers

        })
      }
      axios(config)
        .then(function (resp) {
          const httpStatus = resp.status

          if (httpStatus === 200 || httpStatus === 201) {
            // API returns CREATED on success
            resolve(resp.data)
          } else {
            reject(resp.data)
          };
        })
        .catch(function (error) {
          return reject(error)
        })
    })
  }

  uploadMediaFile (params) {
    const options = _.cloneDeep(params)
    const _self = this

    // Validate params
    const _validateParams = function () {
      const schema = Joi.object({
        url: Joi.string()
          .uri({ scheme: ['https'] })
          .required()
          .messages({
            'string.uri': 'url must contain a VALID URL (https://...)',
            'any.required': 'url is required'
          }),
        phoneNumber: Joi.string().required().messages({
          'any.required': 'phoneNumber is required'
        })
      })

      const { error } = schema.validate(options, { abortEarly: false })
      if (error) {
        throw new Error(error.details.map(detail => detail.message).join('; '))
      }
    }

    _validateParams()

    return new Promise(function (resolve, reject) {
      const config = {
        method: 'post',
        url: `${Common.VOICE_URL}/mediaUpload`,
        headers: {

          apikey: _self.options.apiKey,
          Accept: _self.options.format
        },
        data: JSON.stringify({
          username: _self.options.username,
          url: options.url,
          phoneNumber: options.phoneNumber

        })
      }

      axios(config)
        .then(function (resp) {
          const httpStatus = resp.status

          if (httpStatus === 200 || httpStatus === 201) {
            // API returns CREATED on success
            resolve(resp.data)
          } else {
            reject(resp.data)
          };
        })
        .catch(function (error) {
          return reject(error)
        })
    })
  }
}

module.exports = Voice
