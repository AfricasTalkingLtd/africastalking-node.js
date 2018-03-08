'use strict';

const unirest = require('unirest');
const validate = require('validate.js');
const _ = require('lodash');

const Common = require('./common');

function SMS(options) {

    const _self = this;

    this.options = options;

    this._send = function (params, isBulk, isPremium) {

        let validationError;

        // Validate params
        const _validateParams = function () {

            const constraints = {

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
                        let isInvalid = !/^\+\d{1,3}\d{3,}$/.test(value);
                        if (isInvalid) {
                            return {
                                format: "must be a valid phone number"
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

            const error = validate(params, constraints);
            if (error) {
                let msg = "";
                for (let k in error) {
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

            const body = {
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
                body.bulkSMSMode = 0;
                body.keyword = params.keyword;
                body.linkId = params.linkId;
                if (params.retryDurationInHours) {
                    body.retryDurationInHours = params.retryDurationInHours;
                }
            }

            const rq = unirest.post(Common.SMS_URL);
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
    const opts = _.cloneDeep(params);
    return this._send(opts, false, false);
};

SMS.prototype.sendBulk = function (params) {
    return this.send(params);
};


SMS.prototype.sendPremium = function (params) {
    const opts = _.cloneDeep(params);
    return this._send(opts, false, true);
};

SMS.prototype.fetchMessages = function (params) {
    const _self = this;

    const opts = _.cloneDeep(params) || {};
    opts.lastReceivedId = opts.lastReceivedId || 0;

    return new Promise(function (resolve, reject) {

        const rq = unirest.get(Common.SMS_URL);
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
	const _self = this;
    const opts = _.cloneDeep(params) || {};

    const constraints = {
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

    const validationError = validate(opts, constraints);

    const body = {
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

        const rq = unirest.post(Common.BASE_URL + '/subscription/create');
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
	const _self = this;
    const opts = _.cloneDeep(params) || {};

    const constraints = {
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

    const validationError = validate(opts, constraints);

    opts.lastReceivedId = opts.lastReceivedId || 0;

    return new Promise(function (resolve, reject) {

        // throw validation error inside the promise chain
        if (validationError) {
            return reject(validationError);
        }

        const rq = unirest.get(Common.BASE_URL + '/subscription');
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
