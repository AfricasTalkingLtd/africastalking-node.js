'use strict';

const Joi = require('@hapi/joi');
const axios = require('axios');
const { phoneValidator } = require('./utils');
const Common = require('./common');

class DataBundles {
    constructor(options) {
        this.options = options;
    }

    validateOptions(options) {
        const schema = Joi.object().keys({
            username: Joi.string().required(),
            idempotencyKey: Joi.string().optional(),
            productName: Joi.string().required(),
            recipients: Joi.array().items(
                Joi.object({
                    phoneNumber: Joi.string().required().custom((value) => {
                        return phoneValidator(value).isValid ? value : new Error(`the phone number ${value} is invalid`);
                    }),
                    quantity: Joi.number().required(),
                    unit: Joi.string().valid('MB', 'GB').required(),
                    validity: Joi.string().valid('Day', 'Week', 'BiWeek', 'Month', 'Quarterly').required(),
                    isPromoBundle: Joi.boolean().optional(),
                    metadata: Joi.object().optional(),
                }),
            ).min(1).required(),
        }).required();

        return schema.validate(options);
    }

    send(options) {
        return new Promise((resolve, reject) => {
            const { error, value } = this.validateOptions(options);

            if (error) {
                const combinedMessages = error.details.map(d => d.message).join(';');
                reject(new Error(combinedMessages));
                return;
            } else {

                const headers = {
                    apikey: this.options.apiKey,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }

                if (value.idempotencyKey) {
                    headers['Idempotency-Key'] = idempotencyKey;
                }

                const data = {
                    username: this.options.username,
                    productName: value.productName,
                    recipients: value.recipients
                };

                axios({
                    method: 'post',
                    url: `${Common.DATA_BUNDLES_URL}/mobile/data/request`,
                    headers,
                    data: JSON.stringify(data)
                })
                    .then(function (resp) {
                        const httpStatus = resp.status;
                        if (httpStatus === 200 || httpStatus === 201) {
                            resolve(resp.data);
                        } else {
                            reject(resp.data);
                        };
                    })
                    .catch(function (error) {
                        return reject(error);
                    });
            };
        })
    }
}


module.exports = DataBundles;
