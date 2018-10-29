'use strict';

const unirest  = require('unirest');
const validate = require('validate.js');
const _        = require('lodash');

const Common = require('./common');

const DEFAULT_CURRENCY = 'KES';

function Airtime(options) {
  this.options = options;
}

Airtime.prototype.send = function (params) {

    const _self       = this;
    const options     = _.cloneDeep(params);
    const _recipients = [];
    let validationError;

    // Validate params
    const _validateParams = function () {

        const constraints = {
            recipients: function (value) {

                if (validate.isEmpty(value)) {
                    return {
                        presence: {
                            message: 'is required'
                        }
                    };
                }

                if (!validate.isArray(value)) {
                    console.log("is an array :", validate.isArray(value));
                    return {
                        format: {
                            message: 'must be an array'
                        }
                    };
                }

                if (!value.length) {
                    return {
                        format: {
                            message: 'must be an array of at least one recipient'
                        }
                    };
                }

                for(let i in value) {
                    let recipient    = value[i];
                    let phoneNumber  = recipient.phoneNumber;
                    let currencyCode = recipient.currencyCode;
                    let amount       = recipient.amount;

                    if (validate.isEmpty(phoneNumber) ||
                        validate.isEmpty(currencyCode) ||
                        validate.isEmpty(amount)) {

                        return {
                            format: {
                                message: 'must specify phoneNumber, currencyCode and amount for all recipients'
                            }
                        }
                    }

                    if (!/^\+\d{1,3}\d{3,}$/.test(phoneNumber)) {
                        return {
                            format: {
                                message: 'must not contain invalid phone numbers'
                            }
                        }
                    }

                    if (!validate.isNumber(amount)) {
                        return {
                            format: {
                                message: 'must not contain invalid amount. Must be a number.'
                            }
                        }
                    }
		            _recipients.push( { phoneNumber, "amount" : `${currencyCode} ${amount}` });
                };
                return null;
            }
        };

        const error = validate(options, constraints);
        if (error) {
            var msg = "";
            for (var k in error) {
                msg += error[k] + "; ";
            }
            validationError = new Error(msg);
        }
    }

    _validateParams();

    return new Promise(function (resolve, reject) {

        if (validationError) {
            return reject(validationError);
        }

        let body = {
            username: _self.options.username,
            recipients: JSON.stringify(_recipients)
        };

        let rq = unirest.post(Common.AIRTIME_URL);
        rq.headers({
            apikey: _self.options.apiKey,
            Accept: _self.options.format
        });

        rq.send(body);

        rq.end(function (resp) {
            if (resp.status === 201) {
                // API returns CREATED on success
                resolve(resp.body);
            } else {
                reject(resp.body || resp.error);
            }
        });

    });

};

module.exports = Airtime;
