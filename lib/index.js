'use strict';
var Promise = require('bluebird');
var unirest = require('unirest');
var validate = require('validate.js');
var _ = require('lodash');

var Common = require('./common');

var SMS     = require('./sms');
var USSD    = require('./ussd');
var Airtime = require('./airtime');
var Voice   = require('./voice');
var Payment  = require('./payments');


function AfricasTalking(options) {

    this.options = _.cloneDeep(options);

    validate.validators.isString = function(value, options, key, attributes) {
        if (validate.isEmpty(value) || validate.isString(value)) { // String or null & undefined
            return null;
        } else {
            return "must be a string";
        }
    };

    var constraints = {
        format: {
            inclusion: ['json', 'xml']
        },
        username: {
            presence: true,
            isString: true
        },
        apiKey: {
            presence: true,
            isString: true
        }
    };

    var error = validate(this.options, constraints);
    if (error) {
        throw error;
    }

    switch (this.options.format) {
        case "xml":
            this.options.format = "application/xml";
            break;
        case "json": // Get json by default
        default:
            this.options.format = "application/json";
    }

    var isSandbox = this.options.username.toLowerCase() === 'sandbox';
    if (isSandbox || this.options.debug === true) {
        Common.enableSandbox();
    }

    this.SMS     = new SMS(this.options);
    this.VOICE   = new Voice(this.options);
    this.PAYMENTS = new Payment(this.options);
    this.PAYMENT = this.PAYMENTS; /* So we don't break apps using old version */
    this.AIRTIME = new Airtime(this.options);
    this.USSD    = USSD;
}

// Account
AfricasTalking.prototype.fetchAccount = function () {

    var _self = this;

    return new Promise(function (resolve, reject) {

        var rq = unirest.get(Common.USER_URL);
        rq.headers({
            apiKey: _self.options.apiKey,
            Accept: _self.options.format
        });
        rq.query({'username': _self.options.username});
        rq.end(function (resp) {
            if (resp.status === 200) {
                resolve(resp.body);
            } else {
                reject(resp.error);
            }
        });
    });
};

AfricasTalking.prototype.createCheckoutToken = function (phoneNumber) {

    var _self = this;

    return new Promise(function (resolve, reject) {

        var body = {
            phoneNumber: phoneNumber,
        };

        var rq = unirest.post(Common.CHECKOUT_TOKEN_URL);
        rq.send(body);
        rq.end(function (resp) {
            if (resp.error) return reject(resp.error);

            if (resp.body.token === undefined || resp.body.token === 'None') {
                return reject(resp.body.description);
            }

            return resolve(resp.body.token);
        });
    });
};

module.exports = function (options) {
    return new AfricasTalking(options);
};
