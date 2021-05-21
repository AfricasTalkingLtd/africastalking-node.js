'use strict';

const unirest  = require('unirest');
const validate = require('validate.js');
const _        = require('lodash');

const Common = require('./common');

function Token(options) {
  this.options = options;
}

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
