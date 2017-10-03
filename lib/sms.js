'use strict';

var Promise = require('bluebird');
var unirest = require('unirest');
var validate = require('validate.js');
var _ = require('lodash');

var Common = require('./common');

function SMS(options) {

    var _self = this;

    this.options = options;

    this._send = function (params, isBulk, isPremium) {

        var validationError;

        // Validate params
        var _validateParams = function () {

            var constraints = {

                to: function (value, attributes, attributeName, options, constraints) {
                    if (validate.isEmpty(value)) {
                        return {
                            presence: {message: "is required"}
                        };
                    }

                    if (!validate.isArray(value) && !validate.isString(value)) {
                        return {
                            format: "must be a string or an array strings (phone numbers)"
                        };
                    }

                    if (validate.isString(value)) {
                        // TODO: Validate number format
                        let isInvalid = false;
                        if (isInvalid) {
                            return {
                                format: "must be a valid phone number"
                            };
                        }
                    }

                    if (validate.isArray(value)) {
                        let foundInvalid = false;
                        value.forEach(function (phone) {
                            // TODO: Validate number format
                        });
                        if (foundInvalid) {
                            return {
                                format: "must NOT contain invalid phone number"
                            }
                        }
                    }

                    return null;
                },

                from: {
                    isString: true
                },
                message: {
                    presence: true
                }
            };

            if (isBulk) {
                constraints.enqueue = {
                    inclusion: [true]
                };
            }

            if (isPremium) {
                constraints.keyword = {
                    presence: true,
                    isString: true
                };
                constraints.linkId = {
                    presence: true,
                    isString: true
                };
                constraints.retryDurationInHours = {
                    numericality: true
                }
            }

            var error = validate(params, constraints);
            if (error) {
                var msg = "";
                for (var k in error) {
                    msg += error[k] + "; ";
                }
                validationError = new Error(msg);
            }
        };

        _validateParams();

        // Multiple recipients?
        if (validate.isArray(params.to)) {
            if (params.to.length === 1) {
                params.to = params.to[0];
            } else {
                params.to = params.to.join();
            }
        }

        return new Promise(function (resolve, reject) {

            if (validationError) {
                return reject(validationError);
            }

            var body = {
                username: _self.options.username,
                to: params.to,
                message: params.message
            };

            if (params.from) {
                body.from = params.from
            }

            if (isBulk) {
                body.bulkSMSMode = 1;
                if (params.enqueue) {
                    body.enqueue = 1;
                }
            }

            if (isPremium) {
                body.keyword = params.keyword;
                body.linkId = params.linkId;
                if (params.retryDurationInHours) {
                    body.retryDurationInHours = params.retryDurationInHours;
                }
            }

            var rq = unirest.post(Common.SMS_URL);
            rq.headers({
                apikey: _self.options.apiKey,
                Accept: _self.options.format
            });
            rq.send(body);
            rq.end(function (resp) {
                if (resp.status === 201) { // API returns CREATED on success!?
                    resolve(resp.body);
                } else {
                    reject(resp.error || resp.body);
                }
            });
        });
    };
}


SMS.prototype.send = function (params) {
    var opts = _.cloneDeep(params);
    return this._send(opts, false, false);
};

SMS.prototype.sendBulk = function (params) {
    var opts = _.cloneDeep(params);
    return this._send(opts, true, false);
};


SMS.prototype.sendPremium = function (params) {
    var opts = _.cloneDeep(params);
    return this._send(opts, false, true);
};

SMS.prototype.fetchMessages = function (params) {
    var _self = this;

    var opts = _.cloneDeep(params) || {};
    opts.lastReceivedId = opts.lastReceivedId || 0;

    return new Promise(function (resolve, reject) {

        var rq = unirest.get(Common.SMS_URL);
        rq.headers({
            apikey: _self.options.apiKey,
            Accept: _self.options.format
        });
        rq.query({
            'username': _self.options.username,
            'lastReceivedId': opts.lastReceivedId
        });
        rq.end(function (resp) {
            if (resp.status === 200) {
                resolve(resp.body);
            } else {
                reject(resp.error);
            }
        });
    });

};

SMS.prototype.createSubscription = function (params) {
	var _self = this;
    var opts = _.cloneDeep(params) || {};

    var constraints = {
        shortCode: {
            presence: true,
            isString: true
        },
        keyword: {
            presence: true,
            isString: true
        },
        phoneNumber: {
            presence: true,
            isString: true
        },
        checkoutToken: {
            presence: true,
            isString: true
        }
    };

    var validationError = validate(opts, constraints);

    var body = {
    	username: _self.options.username,
        shortCode: opts.shortCode,
        keyword: opts.keyword,
        phoneNumber: opts.phoneNumber,
        checkoutToken: opts.checkoutToken
    };

    return new Promise(function (resolve, reject) {

        if (validationError) {
            return reject(validationError);
        }

        var rq = unirest.post(Common.BASE_URL + '/subscription/create');
        rq.headers({
            apikey: _self.options.apiKey,
            Accept: _self.options.format
        });
        rq.send(body);
        rq.end(function (resp) {
            if (resp.status === 201) { // API returns CREATED on success!?
                resolve(resp.body);
            } else {
                reject(resp.error || resp.body);
            }
        });

    });

};

SMS.prototype.fetchSubscription = function (params) {
	var _self = this;
    var opts = _.cloneDeep(params) || {};

    var constraints = {
        shortCode: {
            presence: true,
            isString: true
        },
        keyword: {
            presence: true,
            isString: true
        },
        lastReceivedId: {
            numericality: true
        }
    };

    var validationError = validate(opts, constraints);

    opts.lastReceivedId = opts.lastReceivedId || 0;

    return new Promise(function (resolve, reject) {

        // throw validation error inside the promise chain
        if (validationError) {
            return reject(validationError);
        }

        var rq = unirest.get(Common.BASE_URL + '/subscription');
        rq.headers({
            apikey: _self.options.apiKey,
            Accept: _self.options.format
        });
        rq.query({
            'username': _self.options.username,
            'lastReceivedId': opts.lastReceivedId,
            'keyword': opts.keyword,
            'shortCode': opts.shortCode
        });
        rq.end(function (resp) {
            if (resp.status === 200) {
                resolve(resp.body);
            } else {
                reject(resp.error);
            }
        });

    });
};

module.exports = SMS;
