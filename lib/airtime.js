'use strict';

var Promise  = require('bluebird');
var unirest  = require('unirest');
var validate = require('validate.js');
var _        = require('lodash');

var Common = require('./common');

const DEFAULT_CURRENCY = 'KES';

function Airtime(options) {
  this.options = options;
}

Airtime.prototype.send = function (params) {

    let _self       = this;
    let options     = _.cloneDeep(params);
    let _recipients = [];
    let validationError;

    // Validate params
    let _validateParams = function () {


        var constraints = {
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

                    if (!(/^\+?\d+$/).test(phone)) {
                        return {
                            format: 'must not contain invalid phone numbers'
                        }
                    }

                    if (!(amount >= 10 && amount <= 10000)) {
                        return {
                            format: 'must only contain amount between 10 and 10000'
                        }
                    }

                    // format amount with currency
                    let currency     = DEFAULT_CURRENCY;
                    recipient.amount = validate.format(
                        '%{currency} %{amount}',
                        { currency: currency, amount: amount }
                    );
		            _recipients.push( { 'phoneNumber': phone, 'amount': recipient.amount });
                };

                return null;
            }
        };

        validationError = validate(options, constraints);
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
                reject(resp.error || resp.body);
            }
        });

    });

};

module.exports = Airtime;
