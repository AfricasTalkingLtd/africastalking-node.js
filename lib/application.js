'use strict';

const unirest  = require('unirest');
const validate = require('validate.js');
const _        = require('lodash');

const Common = require('./common');

function Application(options) {
  this.options = options;
}

Application.prototype.fetchApplicationData = function () {

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

/* For backward compatibility */
Application.prototype.fetchAccount = Application.prototype.fetchApplicationData;
/* End */

module.exports = Application;
