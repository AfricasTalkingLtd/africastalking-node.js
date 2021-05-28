'use strict';

const unirest = require('unirest');
const validate = require('validate.js');
const _ = require('lodash');

const Common = require('./common');
const Builder = require('./actionbuilder')

function Voice(options) {
    this.options = options;
    this.ActionBuilder = Builder;
}

Voice.prototype.call = function (params) {

    let options = _.cloneDeep(params);
    let _self = this;

    // Validate params
    let _validateParams = function () {

        var constraints = {
            callTo: function (value) {

                if (validate.isEmpty(value)) {
                    return {
                        presence: {
                            message: 'is required'
                        }
                    };
                }

                if (validate.isString(value)) {
                    if (!(/^(?:\+\d{1,3}\d{5,},?){1,}$/).test(value)) {
                        return {
                            format: 'must not contain invalid callTo phone number(s)'
                        };
                    }
                }

                if (validate.isArray(value)) {
                    let foundInvalid = false;
                    value.forEach(function (phone) {
                        foundInvalid = !/^\+\d{1,3}\d{3,}$/.test(phone);
                    });
                    if (foundInvalid) {
                        return {
                            format: "must NOT contain invalid phone number(s)"
                        }
                    }
                }

                return null;
            },
            callFrom: function (value) {

                if (validate.isEmpty(value)) {
                    return {
                        presence: {
                            message: 'is required'
                        }
                    };
                }
                return null;
            },

            clientRequestId: {
                isString: true,
            }
        };

        let error = validate(options, constraints);
        if (error) {
            // TODO should this be rejected by promise instead?

            var msg = "";
            for (var k in error) {
                msg += error[k] + "; ";
            }
            throw new Error(msg);
        }
    }

    _validateParams();

    return new Promise(function (resolve, reject) {

        const body = {
            username: _self.options.username,
            to: options.callTo,
            from: options.callFrom,
            clientRequestId: options.clientRequestId
        };

        const rq = unirest.post(Common.VOICE_URL + '/call');
        rq.headers({
            apikey: _self.options.apiKey,
            Accept: _self.options.format
        });

        rq.send(body);

        rq.end(function (resp) {
            if (resp.status === 200 || resp.status === 201) {
                // API returns CREATED on success
                resolve(resp.body);
            } else {
                reject(resp.body || resp.error);
            }
        });
    });
};

Voice.prototype.getNumQueuedCalls = function (params) {

    let options = _.cloneDeep(params);
    let _self = this;

    // Validate params
    let _validateParams = function () {

        var constraints = {
            phoneNumbers: function (value) {

                if (validate.isEmpty(value)) {
                    return {
                        presence: {
                            message: 'is required'
                        }
                    };
                }

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
        // list of phoneNumbers, comma separated
        let body = {
            username: _self.options.username,
            phoneNumbers: options.phoneNumbers
        };

        let rq = unirest.post(Common.VOICE_URL + '/queueStatus');
        rq.headers({
            apikey: _self.options.apiKey,
            Accept: _self.options.format
        });

        rq.send(body);

        rq.end(function (resp) {
            if (resp.status === 200 || resp.status === 201) {
                // API returns CREATED on success
                resolve(resp.body);
            } else {
                reject(resp.body || resp.error);
            }
        })
    });
};

Voice.prototype.uploadMediaFile = function (params) {
    let options = _.cloneDeep(params);
    let _self = this;

    // Validate params
    let _validateParams = function () {

        var constraints = {
            url: function (value) {
                if (validate.isEmpty(value)) {
                    return {
                        presence: {
                            message: 'is required'
                        }
                    };
                }

                if (!(/^https?\:\/\//).test(value)) {
                    return {
                        format: 'must contain a VALID URL (http(s)://...)'
                    }
                }

                return null;
            },
            phoneNumber: function (value) {

                if (validate.isEmpty(value)) {
                    return {
                        presence: {
                            message: 'is required'
                        }
                    };
                }

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
    };

    _validateParams();

    return new Promise(function (resolve, reject) {
        let body = {
            username: _self.options.username,
            url: options.url,
            phoneNumber: options.phoneNumber
        };

        let rq = unirest.post(Common.VOICE_URL + '/mediaUpload');
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
                reject(resp.body || resp.error);
            }
        });
    });
};

module.exports = Voice;
