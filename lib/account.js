'use strict';

const unirest  = require('unirest');
const validate = require('validate.js');
const _        = require('lodash');

const Common = require('./common');

function Account(options) {
  this.options = options;
}

Account.prototype.fetchAccount = function () {

    const _self       = this;

    return new Promise(function (resolve, reject) {

        const rq = unirest.get(Common.USER_URL);
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

module.exports = Account;
