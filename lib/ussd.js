'use strict'

const bodyParser = require('body-parser')
const joi = require('@hapi/joi')

// as per specs http://docs.africastalking.com/ussd
const CONTENT_TYPE = 'text/plain'
const SESSION_CONTINUE = 'CON '
const SESSION_END = 'END '
const RESPONSE_CODE = 200

/**
 *
 * @param handler
 * @returns {*[]} Connect/express middleware
 * @constructor
 */
function ExpressHandler (handler) {
  return [ // connect/express middleware

    bodyParser.urlencoded({ extended: true }),
    bodyParser.json(),

    function (req, res, next) {
      const params = {
        sessionId: req.body.sessionId,
        serviceCode: req.body.serviceCode,
        phoneNumber: req.body.phoneNumber,
        text: req.body.text
      }

      handler(params, (opts) => {
        const schema = joi.object({
          response: joi.string().required()
            .messages({
              'any.required': '"response" is required',
              'string.base': '"response" must be a string'
            }),
          endSession: joi.boolean().required()
            .messages({
              'any.required': '"endSession" is required',
              'boolean.base': '"endSession" must be true or false'
            })
        })

        const { error } = schema.validate(opts, { abortEarly: false })

        // express uses next(err) to pass back errors
        if (error) {
          const messages = error.details.map(d => d.message)
          return next(messages)
        }

        let response = opts.response

        if (opts.endSession) {
          response = SESSION_END + response
        } else {
          response = SESSION_CONTINUE + response
        }
        res.contentType(CONTENT_TYPE)
        res.status(RESPONSE_CODE).send(response)
      })
    }
  ]
}

// TODO: Helpers for other frameworks?

module.exports = ExpressHandler
