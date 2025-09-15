'use strict'

const Joi = require('joi')

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
    function (req, res, next) {
      let body = []
      req
        .on('data', chunk => { body.push(chunk) })
        .on('end', () => {
          try {
            body = Buffer.concat(body).toString()
            const payload = Object.fromEntries(new URLSearchParams(body))
            handler(payload, (opts) => {
              const schema = Joi.object({
                response: Joi.string().required()
                  .messages({
                    'any.required': '"response" is required',
                    'string.base': '"response" must be a string'
                  }),
                endSession: Joi.boolean().required()
                  .messages({
                    'any.required': '"endSession" is required',
                    'boolean.base': '"endSession" must be true or false'
                  })
              })

              const { error } = schema.validate(opts, { abortEarly: false })

              // express uses next(err) to pass back errors
              if (error) {
                const messages = error.details.map(detail => detail.message)
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
          } catch (ex) {
            next(ex)
          }
        })
    }
  ]
}

// TODO: Helpers for other frameworks?

module.exports = ExpressHandler
