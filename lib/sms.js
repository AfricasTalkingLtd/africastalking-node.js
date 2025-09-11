'use strict'

const axios = require('axios')
const Joi = require('joi')
const _ = require('lodash')

const Common = require('./common')

class SMS {
  constructor (options) {
    const _self = this

    this.options = options

    this._send = function (params, isBulk, isPremium) {
      let validationError

      // Validate params
      const _validateParams = function () {
        let schema = Joi.object({
          to: Joi.alternatives().try(
            Joi.string().custom((value, helpers) => {
              if (!Common.phoneUtil.isValidNumber(value)) {
                return helpers.error('any.invalid')
              }
              return value
            }).messages({
              'any.invalid': 'must be a valid phone number',
              'string.base': 'must be a string or an array of strings (phone numbers)'
            }),
            Joi.array().items(
              Joi.string().custom((value, helpers) => {
                if (!Common.phoneUtil.isValidNumber(value)) {
                  return helpers.error('any.invalid')
                }
                return value
              }).messages({
                'any.invalid': 'must NOT contain invalid phone number',
                'string.base': 'each phone number must be a string'
              })
            )
          ).required()
            .messages({ 'any.required': 'is required' }),
          from: Joi.string().optional(),
          senderId: Joi.string().optional(),
          message: Joi.required()
        })

        if (isBulk) {
          schema = schema.append({
            enqueue: Joi.boolean().optional()
          })
        }

        if (isPremium) {
          schema = schema.append({
            keyword: Joi.string().required(),
            linkId: Joi.string().optional(),
            retryDurationInHours: Joi.number().optional()
          })
        }

        const { error } = schema.validate(params, { abortEarly: false })
        if (error) {
          let msg = ''
          for (const detail of error.details) {
            msg += detail.message + '; '
          }
          validationError = new Error(msg)
        }
      }

      _validateParams()

      // Multiple recipients?
      if (Array.isArray(params.to)) {
        params.to = params.to.join()
      }

      return new Promise(function (resolve, reject) {
        if (validationError) {
          return reject(validationError)
        }
        const body = {
          username: _self.options.username,
          to: params.to,
          message: params.message
        }
        /**
         * TO DO -> once the sandbox for new bulk SMS is live:
         * - Remove "from" entirely
         * - Change the endpoint to the new bulk SMS endpoint
         */
        if (params.from || params.senderId) {
          body.from = params.from || params.senderId
        }

        if (isBulk) {
          body.bulkSMSMode = 1
          if (params.enqueue) {
            body.enqueue = 1
          }
          if (params.enqueue === false) {
            body.enqueue = 0
          }
        }
        if (isPremium) {
          body.bulkSMSMode = 0
          body.keyword = params.keyword
          body.linkId = params.linkId
          if (params.retryDurationInHours) {
            body.retryDurationInHours = params.retryDurationInHours
          }
        }

        const url = isBulk ? Common.SMS_URL : Common.CONTENT_URL + '/messaging'

        const headers = {
          apikey: _self.options.apiKey,
          Accept: _self.options.format
        }

        axios({
          method: 'POST',
          url,
          headers,
          data: new URLSearchParams(body)
        })
          .then(function (response) {
            if (response.status === 201) {
              // API returns CREATED on success!?
              resolve(response.data)
            } else {
              reject(response.data)
            }
          })
          .catch(function (error) {
            reject(error)
          })
      })
    }
  }

  send (params) {
    const opts = _.cloneDeep(params)

    if (Array.isArray(opts)) {
      const results = opts.map((opt) => {
        return this._send(opt, true, false)
      })

      return Promise.allSettled(results).then((results) => {
        return results.map((result) => {
          if (result.status === 'fulfilled') {
            return result.value
          } else {
            return {
              SMSMessageData: {
                Message: result.reason,
                status: 'failed'
              }
            }
          }
        })
      })
    } else {
      return this._send(opts, true, false)
    }
  }

  sendBulk (params) {
    return this.send(params)
  }

  sendPremium (params) {
    const opts = _.cloneDeep(params)
    return this._send(opts, false, true)
  }

  fetchMessages = function (params) {
    const _self = this
    const opts = _.cloneDeep(params) || {}
    opts.lastReceivedId = opts.lastReceivedId || 0
    return new Promise(function (resolve, reject) {
      const headers = {
        apikey: _self.options.apiKey,
        Accept: _self.options.format
      }

      const query = new URLSearchParams({
        username: _self.options.username,
        lastReceivedId: opts.lastReceivedId,
        keyword: opts.keyword,
        shortCode: opts.shortCode
      }).toString()

      const url = `${Common.SMS_URL}?${query}`

      axios({
        method: 'GET',
        url,
        headers
      })
        .then(function (response) {
          if (response.status === 200) {
            resolve(response.data)
          } else {
            reject(response.data)
          }
        })
        .catch(function (error) {
          reject(error)
        })
    })
  }

  createSubscription (params) {
    const _self = this
    const opts = _.cloneDeep(params) || {}

    const schema = Joi.object({
      shortCode: Joi.string().required(),
      keyword: Joi.string().required(),
      phoneNumber: Joi.string().required()
    })

    const { error } = schema.validate(opts, { abortEarly: false })
    if (error) {
      return Promise.reject(error)
    }

    const body = {
      username: _self.options.username,
      shortCode: opts.shortCode,
      keyword: opts.keyword,
      phoneNumber: opts.phoneNumber
    }

    return new Promise(function (resolve, reject) {
      const url = `${Common.CONTENT_URL}/subscription/create`
      const headers = {
        apikey: _self.options.apiKey,
        Accept: _self.options.format
      }

      axios({
        method: 'POST',
        url,
        headers,
        data: new URLSearchParams(body)
      })
        .then(function (response) {
          if (response.status === 201) {
            // API returns CREATED on success!?
            resolve(response.data)
          } else {
            reject(response.data)
          }
        })
        .catch(function (error) {
          reject(error)
        })
    })
  };

  fetchSubscription (params) {
    const _self = this
    const opts = _.cloneDeep(params) || {}
    opts.lastReceivedId = opts.lastReceivedId || 0

    const schema = Joi.object({
      shortCode: Joi.string().required(),
      keyword: Joi.string().required(),
      lastReceivedId: Joi.number().optional()
    })

    const { error } = schema.validate(opts, { abortEarly: false })
    if (error) {
      return Promise.reject(error)
    }

    return new Promise(function (resolve, reject) {
      const headers = {
        apikey: _self.options.apiKey,
        Accept: _self.options.format
      }

      const query = new URLSearchParams({
        username: _self.options.username,
        lastReceivedId: opts.lastReceivedId,
        keyword: opts.keyword,
        shortCode: opts.shortCode
      }).toString()

      const url = `${Common.CONTENT_URL}/subscription?${query}`

      axios({
        method: 'GET',
        url,
        headers
      })
        .then(function (response) {
          if (response.status === 200) {
            resolve(response.data)
          } else {
            reject(response.data)
          }
        })
        .catch(function (error) {
          reject(error)
        })
    })
  };

  deleteSubscription (params) {
    const _self = this
    const options = _.cloneDeep(params)
    let validationError

    const _validateParams = function () {
      const schema = Joi.object({
        shortCode: Joi.string().required(),
        keyword: Joi.string().required(),
        phoneNumber: Joi.string().required()
      })

      const { error } = schema.validate(options, { abortEarly: false })
      if (error) {
        let msg = ''
        for (const detail of error.details) {
          msg += detail.message + '; '
        }
        validationError = new Error(msg)
      }
    }

    _validateParams()

    return new Promise(function (resolve, reject) {
      if (validationError) {
        return reject(validationError)
      }

      const { username, apiKey, format } = _self.options
      const { shortCode, keyword, phoneNumber } = options
      const body = {
        username,
        shortCode,
        keyword,
        phoneNumber
      }

      const url = `${Common.CONTENT_URL}/subscription/delete`
      const headers = {
        apiKey,
        Accept: format,
        'Content-Type': 'application/x-www-form-urlencoded'
      }

      axios({
        method: 'POST',
        url,
        headers,
        data: new URLSearchParams(body)
      })
        .then(function (response) {
          if ([200, 201].includes(response.status)) {
            resolve(response.data)
          } else {
            reject(response.data)
          }
        })
        .catch(function (error) {
          reject(error)
        })
    })
  };
};

module.exports = SMS
