'use strict';
var Promise = require('bluebird');
var unirest = require('unirest');
var validate = require('validate.js');

var Common = require('./common');

var SMS = require('./sms');


validate.validators.isString = function(value, options, key, attributes) {
    if (validate.isString(value)) {
        return null;
    } else {
        return "must be a string";
    }
};


function AfricasTalking(options) {
    this.options = options;

    this.SMS = new SMS();
    this.VOICE = null;
    this.USSD = null;
    this.AIRTIME = null;
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

    var invalid = validate(options, constraints);
    if (invalid) {
        console.error(invalid);
        return null;
    }

    switch (options.format) {
        case "xml":
            options.format = "application/xml";
            break;
        case "json": // Get json by default
        default:
            options.format = "application/json";
    }

    return new AfricasTalking(options);
};