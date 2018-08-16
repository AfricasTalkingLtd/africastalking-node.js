'use strict';

const unirest = require('unirest');
const validate = require('validate.js');
const _ = require('lodash');

const Common = require('./common');

function Voice(options) {
    this.options = options;
    this.buildAction = function (action) {

        const {
            tag,
            text,
            children,
            attributes
        } = action;

        let str = '<' + tag;

        if (Object.keys(attributes).length > 0) {
            Object.entries(attributes)
                .forEach( ([key, value]) => {
                    str = str.concat(` ${key}="${value}"`);
                });
        }

        if (children.length > 0) {
            str.concat('>');
            children.forEach( child => {
                str = str.concat(this.buildAction(child));
            });
            str = str.concat(`</${tag}>`);
        } else {
            if (text) {
                str = str.concat(`>${text}</${tag}>`);
            } else {
                str = str.concat('/>');
            }
        }

        return str;
    }
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
                if (!(/^\+\d{1,3}\d{3,}$/).test(value)) {
                    return {
                        format: 'must not contain invalid callTo phone number'
                    };
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
            from: options.callFrom
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

Voice.prototype.Say = function (params) {
    let options = _.cloneDeep(params);
    let _self = this;
    let validationError;

    let action = {};

    let  _validateParams = function () {

        const constraints = {
            text: function (value) {
                if (value && !validate.isString(value)) {
                    return {
                        format: 'text must be a string'
                    }
                }
                return {
                    presence: true
                }
            },
            voice: function(value) {
                let choices = ['man', 'woman'];
                if (value && !choices.includes(value)) {
                    return {
                        format: 'invalid option'
                    }
                }
                return null;
            },
            playBeep: function (value) {
                if(!validate.isBoolean(value)) {
                    return {
                        format: 'invalid option'
                    }
                }
                return null;
            }
        };

        let error = validate(options, constraints);
        if (error) {
            let msg = '';
            for (let k in error) {
                msg += error[k] + "; ";
            }

            validationError = new Error(msg);
        }
    }

    _validateParams();

    if (validationError) {
        throw validationError;
    }

    const {
        text,
        voice,
        playBeep
    } = options;

    action.tag        = 'Say';
    action.text       = text;
    action.children   = [];
    action.attributes = {}

    if (voice) action.attributes.voice       = voice;
    if (playBeep) action.attributes.playBeep = playBeep;

    return this.buildAction(action);
}

Voice.prototype.Play = function (params) {
    let options = _.cloneDeep(params);
    let _self = this;
    let validationError;

    let action = {};

    let  _validateParams = function () {

        const constraints = {
            url: {
                presence: true,
                url: true
            }
        };

        let error = validate(options, constraints);
        if (error) {
            let msg = '';
            for (let k in error) {
                msg += error[k] + "; ";
            }

            validationError = new Error(msg);
        }
    }

    _validateParams();

    if (validationError) {
        throw validationError;
    }

    action.tag = 'Play';
    action.text = '';
    action.children = []
    action.attributes = {
        url: options.url
    }

    return this.buildAction(action);
}

Voice.prototype.Dial = function (params) {
    let options = _.cloneDeep(params);
    let _self = this;
    let validationError;

    let action = {};

    let  _validateParams = function () {

        const constraints = {
            phoneNumbers: function (value) {

                if (value && !validate.isString(value)) {
                    return {
                        format: 'must be a string'
                    };
                }
                return {
                    presence: true
                }
            },
            record: function (value) {
                if (!validate.isBoolean(value)) {
                    return {
                        format: 'invalid option'
                    }
                }
                return null
            },
            sequential: function (value) {
                if (!validate.isBoolean(value)) {
                    return {
                        format: 'invalid option'
                    }
                }
                return null;
            },
            callerId: function (value) {

                if (!(/^\+\d{1,3}\d{3,}$/).test(value)) {
                    return {
                        format: 'must not contain invalid phone number'
                    };
                }
                return null;
            },
            ringBackTone: {
                url: true
            },
            maxDuration: function (value) {
                if (!validate.isNumber(value)) {
                    return {
                        format: 'must be time in secoinds'
                    }
                }
            }
        };

        let error = validate(options, constraints);
        if (error) {
            let msg = '';
            for (let k in error) {
                msg += error[k] + "; ";
            }

            validationError = new Error(msg);
        }
    }

    _validateParams();

    if (validationError) {
        throw validationError;
    }

    const {
        phoneNumbers,
        record,
        sequential,
        callerId,
        ringBackTone,
        maxDuration
    } = options;

    action.tag        = 'Dial';
    action.text       = '';
    action.children   = []
    action.attributes = {
        phoneNumbers
    }

    if (record) action.attributes.record             = record;
    if (sequential) action.attributes.sequential     = sequential;
    if (callerId) action.attributes.callerId         = callerId;
    if (ringBackTone) action.attributes.ringBackTone = ringBackTone;
    if (maxDuration) action.attributes.maxDuration   = maxDuration;

    return this.buildAction(action);
}

Voice.prototype.Reject = function () {
    let _self = this;

    let action = {
        tag: 'Reject',
        text: '',
        children: [],
        attributes: {}
    };

    return this.buildAction(action);
}

module.exports = Voice;
