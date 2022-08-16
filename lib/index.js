'use strict';
const validate  = require('validate.js');
const _         = require('lodash');

const Common    = require('./common');

const Application   = require('./application');
const Token     = require('./token');
const SMS       = require('./sms');
const USSD      = require('./ussd');
const Airtime   = require('./airtime');
const Voice     = require('./voice');
const Payment   = require('./payments');


class AfricasTalking {
    constructor(options) {

        this.options = _.cloneDeep(options);

        validate.validators.isString = function (value, options, key, attributes) {
            return validate.isEmpty(value) || validate.isString(value) ? null : "must be a string";
        };

        const constraints = {
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

        const error = validate(this.options, constraints);
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
        if (isSandbox) {
            Common.enableSandbox();
        }
        this.APPLICATION = new Application(this.options);
        /* For backward compatibility */
        this.ACCOUNT = this.APPLICATION;
        /* End */
        this.SMS = new SMS(this.options);
        this.VOICE = new Voice(this.options);
        this.PAYMENTS = new Payment(this.options);
        this.PAYMENT = this.PAYMENTS; /* So we don't break apps using old version */
        this.AIRTIME = new Airtime(this.options);
        this.TOKEN = new Token(this.options);
        this.USSD = USSD;
    }
}

module.exports = function (options) {
    return new AfricasTalking(options);
};
