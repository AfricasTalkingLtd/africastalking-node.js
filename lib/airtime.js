'use strict';

const Joi = require('@hapi/joi');
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

            const { recipients: rawRecipients } = value;
            const recipients = rawRecipients.map(r => ({
                phoneNumber: r.phoneNumber,
                amount: `${r.currencyCode} ${r.amount}`,
            }));

            const customAxios = initializeAxios(this.config, false);
            
            customAxios.airtime.sendAirtimeRequest({
                recipients: JSON.stringify(recipients),
            })
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
        const schema = Joi.object({
            recipients: Joi.array().items(
                Joi.object({
                    phoneNumber: Joi.string().required().pattern(/^\+\d{1,3}\d{3,}$/),
                    currencyCode: Joi.string().required(),
                    amount: Joi.number().required(),
                }),
            ).min(1).required(),
        }).length(1).required();

        return schema.validate(options);
    }
}

module.exports = Airtime;
