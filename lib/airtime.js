'use strict';

const Joi = require('@hapi/joi');
const { phone: phoneValidator } = require('phone');

const initializeAxios = require('./customAxios');

class Airtime {
    constructor(config) {
        this.config = config;
    }

    send(options) {
        return new Promise((resolve, reject) => {
            const { error, value } = this.validateOptions(options);

            if (error) {
                const combinedMessages = error.details.map(d => d.message).join(';');
                reject(new Error(combinedMessages));
                return;
            }

            const rawRecipients = value.recipients;
            const recipients = rawRecipients.map(r => ({
                phoneNumber: r.phoneNumber,
                amount: `${r.currencyCode} ${r.amount}`,
            }));
            const customAxios = value.idempotencyKey ? initializeAxios(this.config, value.idempotencyKey) : initializeAxios(this.config);

            const requestBody = {
                recipients: JSON.stringify(recipients)
            };

            if(options.maxNumRetry && (options.maxNumRetry > 0) ){
                requestBody['maxNumRetry'] = Number(options.maxNumRetry);
            };
            
            customAxios.airtime.sendAirtimeRequest(requestBody)
            .then(function (response) {
                if (response.status === 201) {
                    resolve(response.data);
                } else {
                    reject(response.data || response.error);
                }
            })
            .catch(function (err) {
                reject(err);
            });
        });        
    }

    validateOptions(options) {
        const schema = Joi.object().keys({
            idempotencyKey: Joi.string().optional(),
            recipients: Joi.array().items(
                Joi.object({
                    phoneNumber:Joi.string().required().custom((value)=>{
                        return phoneValidator(value).isValid? value : new Error(`the phone number ${value} is invalid`);
                    }),
                    currencyCode: Joi.string().required(),
                    amount: Joi.number().required(),
                }),
            ).min(1).required(),
            maxNumRetry: Joi.number().optional(),
        }).required();

        return schema.validate(options);
    }
}

module.exports = Airtime;
