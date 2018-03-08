'use strict';

const unirest  = require('unirest');
const validate = require('validate.js');
const _        = require('lodash');

const Common = require('./common');

function Token(options) {
  this.options = options;
}

Token.prototype.createCheckoutToken = function (phoneNumber) {

    var _self = this;

    return new Promise(function (resolve, reject) {

        if (!/^\+\d{1,3}\d{3,}$/.test(phoneNumber)) {
            return reject(new Error('Invalid phone number'));
        }

        var rq = unirest.post(Common.CHECKOUT_TOKEN_URL);
        rq.send({
            phoneNumber,
        });
        rq.end(function (resp) {
            if (resp.error) return reject(resp.error);

            if (resp.body.token === undefined || resp.body.token === 'None') {
                return reject(resp.body.description);
            }

            return resolve(resp.body);
        });
    });
};

Token.prototype.generateAuthToken = function () {

    var _self = this;

    return new Promise(function (resolve, reject) {

        var body = {
            username: _self.options.username,
        };

        var rq = unirest.post(Common.AUTH_TOKEN_URL);
        rq.headers({
            apiKey: _self.options.apiKey,
            Accept: _self.options.format,
            'Content-Type': 'application/json'
        });
        rq.send(body);
        rq.end(function (resp) {
            if (resp.error) return reject(resp.error);

            if (resp.body.token === undefined || resp.body.token === 'None') {
                return reject(resp.body.description);
            }

            return resolve(resp.body);
        });
    });
};

module.exports = Token;
