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
                    return {
                        format: 'must be an array'
                    };
                }

                if (!value.length) {
                    return {
                        format: 'must be an array of at least one recipient'
                    };
                }

                for(let i in value) {
                    let recipient = value[i];
                    let phone     = recipient.phoneNumber;
                    let amount    = recipient.amount;

                    if (validate.isEmpty(phone) ||
                        validate.isEmpty(amount)) {

                        return {
                            format: 'must all specify phoneNumber and amount'
                        }
                    }

                    if (!/^\+\d{1,3}\d{3,}$/.test(phone)) {
                        return {
                            format: 'must not contain invalid phone numbers'
                        }
                    }


                    if(!(/^[a-zA-Z]{3} \d+(\.\d{1,2})?$/).test(amount)) {
                        return {
                            format: 'must contain a currency followed by an amount'
                        }
                    }
		            _recipients.push( { 'phoneNumber': phone, 'amount': amount });
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
            throw new Error(msg);
        }
    }

    return new Promise(function (resolve, reject) {

        try {
            _validateParams();
        } catch (error) {
            return reject(error);
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
                reject(resp.error || resp.body);
            }
        });

    });

};

module.exports = Airtime;
