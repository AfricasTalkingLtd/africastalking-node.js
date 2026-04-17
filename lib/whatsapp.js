'use strict'

const Joi = require('joi')
const axios = require('axios')

const Common = require('./common')

class WhatsApp {
  constructor (options) {
    this.options = options
  };

  sendMessage (payload) {
    const _self = this
    let validationError

    const schema = Joi.object({
      waNumber: Joi.string().required(),
      phoneNumber: Joi.string().custom((value, helpers) => {
        if (!Common.phoneUtil.isValidNumber(value)) {
          return helpers.error('any.invalid')
        }
        return value
      }).messages({
        'any.invalid': 'must be a valid phone number'
      }),
      body: Joi.alternatives().try(

        // Simple text message
        Joi.object({
          message: Joi.string().required()
        }),

        // Template message
        Joi.object({
          templateId: Joi.string().required(),
          headerValue: Joi.string().required(),
          bodyValues: Joi.array().items(Joi.string()).required()
        }),

        // Media message
        Joi.object({
          mediaType: Joi.string().valid('Image', 'Video', 'Audio', 'Voice').required(),
          url: Joi.string().uri({ scheme: ['https'] }).required(),
          caption: Joi.string().optional()
        }),

        // Interactive list
        Joi.object({
          action: Joi.object({
            button: Joi.string(),
            sections: Joi.array().items(Joi.object({
              title: Joi.string(),
              product_items: Joi.array().items(Joi.object()),
              rows: Joi.array().items(Joi.object({
                id: Joi.string(),
                title: Joi.string(),
                description: Joi.string()
              })).required()
            }))
          }),
          body: Joi.object({ text: Joi.string() }).optional(),
          header: Joi.object({ text: Joi.string() }).optional(),
          footer: Joi.object({ text: Joi.string() }).optional()
        }),

        // Interactive button
        Joi.object({
          action: Joi.object({
            buttons: Joi.array().items(Joi.object({
              id: Joi.string(),
              title: Joi.string()
            }))
          }),
          body: Joi.object({ text: Joi.string() }).optional(),
          header: Joi.object({ text: Joi.string() }).optional()
        })

      ).required()
    })

    const { error } = schema.validate(payload)

    if (error) {
      validationError = new Error(error.details.map(detail => detail.message).join('; '))
    }
    return new Promise((resolve, reject) => {
      if (validationError) {
        return reject(validationError)
      }
      const config = {
        method: 'post',
        url: `${Common.CHAT_URL}/whatsapp/message/send`,
        headers: {
          apiKey: _self.options.apiKey,
          Accept: _self.options.format,
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          ...payload,
          username: _self.options.username
        })
      }
      axios(config)
        .then(function (resp) {
          return resolve(resp.data)
        })
        .catch(function (error) {
          if (error.response && error.response.data) {
            return reject(error.response.data)
          }
          return reject(error)
        })
    })
  }

  createTemplate (payload) {
    const _self = this
    let validationError

    const schema = Joi.object({
      waNumber: Joi.string().required(),
      name: Joi.string().required(),
      language: Joi.string().length(2).lowercase().required(),
      category: Joi.string().valid('MARKETING', 'UTILITY', 'AUTHENTICATION').required(),

      components: Joi.object({
        header: Joi.object({
          type: Joi.string().valid('HEADER').required(),
          format: Joi.string().valid('LOCATION', 'TEXT', 'DOCUMENT', 'IMAGE', 'VIDEO').required(),
          text: Joi.string().optional(),
          example: Joi.alternatives().try(
            Joi.object({
              header_handle: Joi.string()
            }),
            Joi.object({
              header_text: Joi.string()
            })
          ).optional()
        }).optional(),

        body: Joi.object({
          type: Joi.string().valid('BODY').required(),
          text: Joi.string().required(),
          example: Joi.object({
            body_text: Joi.array().items(Joi.string())
          }).optional()
        }).optional(),

        footer: Joi.object({
          type: Joi.string().valid('FOOTER').required(),
          text: Joi.string().required(),
          example: Joi.object({
            body_text: Joi.array().items(Joi.string())
          }).optional()
        }).optional(),

        buttons: Joi.object({
          type: Joi.string().valid('BUTTONS').required(),
          buttons: Joi.array().items(
            Joi.object({
              type: Joi.string().valid('PHONE_NUMBER').required(),
              phone_number: Joi.string().custom((value, helpers) => {
                if (!Common.phoneUtil.isValidNumber(value)) {
                  return helpers.error('any.invalid')
                }
                return value
              }).messages({
                'any.invalid': 'must be a valid phone number'
              }),
              text: Joi.string().required()
            }),

            Joi.object({
              type: Joi.string().valid('URL').required(),
              url: Joi.string().required(),
              text: Joi.string().required(),
              example: Joi.array().items(Joi.string()).optional()
            }),

            Joi.object({
              type: Joi.string().valid('QUICK_REPLY').required(),
              text: Joi.string().required()
            }),

            Joi.object({
              type: Joi.string().valid('FLOW').required(),
              text: Joi.string().required(),
              flow_id: Joi.string().required(),
              flow_action: Joi.string().valid('navigate', 'data_exchange').required(),
              navigate_screen: Joi.string().optional()
            }),

            Joi.object({
              type: Joi.string().valid('COPY_CODE').required(),
              example: Joi.string().required()
            })
          )
        }).optional()

      }).required()
    })

    const { error } = schema.validate(payload)

    if (error) {
      validationError = new Error(error.details.map(detail => detail.message).join('; '))
    }
    return new Promise((resolve, reject) => {
      if (validationError) {
        return reject(validationError)
      }
      const config = {
        method: 'post',
        url: `${Common.CHAT_URL}/whatsapp/template/send`,
        headers: {
          apiKey: _self.options.apiKey,
          Accept: _self.options.format,
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          ...payload,
          username: _self.options.username
        })
      }
      axios(config)
        .then(function (resp) {
          return resolve(resp.data)
        })
        .catch(function (error) {
          if (error.response && error.response.data) {
            return reject(error.response.data)
          }
          return reject(error)
        })
    })
  }
}

module.exports = WhatsApp
