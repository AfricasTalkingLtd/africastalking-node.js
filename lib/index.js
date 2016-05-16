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
var Paymet  = require('./payment');


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

    this.SMS     = new SMS(this.options);
    this.VOICE   = new Voice(this.options);
    this.PAYMENT = new Paymet(this.options);
    this.USSD    = USSD;
    this.AIRTIME = new Airtime(this.options);
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



module.exports = function (options) {
    return new AfricasTalking(options);
};
