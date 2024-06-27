'use strict'

const axios = require('axios')
const validate = require('validate.js')
const _ = require('lodash')
const { phoneValidator } = require('./utils')

const Common = require('./common')

class SMS {
  constructor (options) {
    const _self = this

    this.options = options

    this._send = function (params, isBulk, isPremium) {
      let validationError

      // Validate params
      const _validateParams = function () {
        const constraints = {
          to: function (value, attributes, attributeName, options, constraints) {
            if (validate.isEmpty(value)) {
              return {
                presence: { message: 'is required' }
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
          },
          from: {
            isString: true
          },
          message: {
            presence: true
          }
        }
        if (isBulk) {
          constraints.enqueue = {
            inclusion: [true, false]
          }
        }
        if (isPremium) {
          constraints.keyword = {
            presence: true,
            isString: true
          }
          constraints.linkId = {
            presence: false,
            isString: true
          }
          constraints.retryDurationInHours = {
            numericality: true
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
      // Multiple recipients?
      if (validate.isArray(params.to)) {
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
        if (params.from) {
          body.from = params.from
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
    const constraints = {
      shortCode: {
        presence: true,
        isString: true
      },
      keyword: {
        presence: true,
        isString: true
      },
      phoneNumber: {
        presence: true,
        isString: true
      }
    }
    const validationError = validate(opts, constraints)
    const body = {
      username: _self.options.username,
      shortCode: opts.shortCode,
      keyword: opts.keyword,
      phoneNumber: opts.phoneNumber
    }
    return new Promise(function (resolve, reject) {
      if (validationError) {
        return reject(validationError)
      }

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

    const constraints = {
      shortCode: {
        presence: true,
        isString: true
      },
      keyword: {
        presence: true,
        isString: true
      },
      lastReceivedId: {
        numericality: true
      }
    }
    const validationError = validate(opts, constraints)
    opts.lastReceivedId = opts.lastReceivedId || 0
    return new Promise(function (resolve, reject) {
      // throw validation error inside the promise chain
      if (validationError) {
        return reject(validationError)
      };

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
      const constraints = {
        shortCode: {
          presence: true,
          isString: true
        },
        keyword: {
          presence: true,
          isString: true
        },
        phoneNumber: {
          presence: true,
          isString: true
        }
      }
      const error = validate(options, constraints)

      const makeErrorMessage = function (error) {
        let msg = ''
        for (const k in error) {
          msg += error[k] + '; '
        }
        validationError = new Error(msg)
      }
      if (error) {
        makeErrorMessage(error)
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
          if (response.status === 200) {
            // API deleted successfully
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
