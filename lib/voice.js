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
          headers: Common.applySdkHeaders({
            apikey: this.options.apiKey,
            Accept: this.options.format,
            'Content-Type': 'application/x-www-form-urlencoded'
          }),
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
        headers: Common.applySdkHeaders({
          apikey: _self.options.apiKey,
          Accept: _self.options.format
        }),
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
        headers: Common.applySdkHeaders({

          apikey: _self.options.apiKey,
          Accept: _self.options.format
        }),
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

  requestCapabilityToken (params) {
    const _self = this
    const options = _.cloneDeep(params) || {}

    return new Promise(function (resolve, reject) {
      const schema = Joi.object({
        clientName: Joi.string()
          .pattern(/^\S+$/)
          .required()
          .messages({
            'string.base': 'clientName must be a string, e.g. "browser"',
            'string.pattern.base': 'clientName must not contain spaces, e.g. "browser"',
            'any.required': 'clientName is required, e.g. "browser"'
          }),
        phoneNumber: Joi.string()
          .custom((value, helpers) => {
            if (!Common.phoneUtil.isValidNumber(value)) {
              return helpers.error('any.invalid')
            }
            return value
          })
          .required()
          .messages({
            'string.base': 'phoneNumber must be a string in E.164 format, e.g. "+254711223344"',
            'any.invalid': 'phoneNumber must be a valid E.164 phone number, e.g. "+254711223344"',
            'any.custom': 'phoneNumber must be a valid E.164 phone number, e.g. "+254711223344"',
            'any.required': 'phoneNumber is required in E.164 format, e.g. "+254711223344"'
          }),
        incoming: Joi.boolean()
          .default(true)
          .messages({ 'boolean.base': 'incoming must be true or false, e.g. true' }),
        outgoing: Joi.boolean()
          .default(true)
          .messages({ 'boolean.base': 'outgoing must be true or false, e.g. true' }),
        expire: Joi.any()
          .custom((value, helpers) => {
            let seconds = value

            if (typeof value === 'string') {
              const match = /^(\d+)s?$/.exec(value)
              seconds = match ? Number(match[1]) : NaN
            }

            if (Number.isInteger(seconds) && seconds > 0) {
              return seconds
            }
            return helpers.error('any.invalid')
          })
          .default(86400)
          .messages({
            'any.invalid': 'expire must be a positive number of seconds, e.g. 3600 or "3600s"',
            'any.custom': 'expire must be a positive number of seconds, e.g. 3600 or "3600s"'
          })
      })

      const { error, value } = schema.validate(options, { abortEarly: false })

      if (error) {
        reject(new Error(error.details.map(detail => detail.message).join('; ')))
        return
      }

      const config = {
        method: 'post',
        url: `${Common.WEBRTC_URL}/capability-token/request`,
        headers: Common.applySdkHeaders({
          apikey: _self.options.apiKey,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }),
        data: JSON.stringify({
          username: _self.options.username,
          phoneNumber: value.phoneNumber,
          clientName: value.clientName,
          incoming: value.incoming,
          outgoing: value.outgoing,
          expire: `${value.expire}s`
        })
      }

      axios(config)
        .then(function (resp) {
          const httpStatus = resp.status

          if (httpStatus === 200 || httpStatus === 201) {
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
