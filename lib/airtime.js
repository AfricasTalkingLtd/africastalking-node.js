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


                    if(!(/^[a-zA-Z]{3} \d+(\.\d{1,2})?$/).test(amount)) {
                        return {
                            format: 'must contain a currency followed by an amount between 10 and 10000'
                        }
                    }
		            _recipients.push( { 'phoneNumber': phone, 'amount': amount });
                };

                return null;
            }
        };

        let error = validate(options, constraints);
        if (error) {
            var msg = "";
            for (var k in error) {
                msg += error[k] + "; ";
            }
            throw new Error(msg);
        }
    }

    _validateParams();

    return new Promise(function (resolve, reject) {

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
