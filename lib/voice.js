'use strict'

var Promise = require('bluebird');
var unirest = require('unirest');
var validate = require('validate.js');
var _ = require('lodash');

var Common = require('./common');


function Voice(options) {
    this.options = options;
}

Voice.prototype.call = function (params) {
    
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
                
                for(let i in value) {
                    let numbers = value[i];
                    let callTo = numbers.callTo;
                    let callFrom = numbers.callFrom;
                    
                    if (validate.isEmpty(callTo) || validate.isEmpty(callFrom)) {
                        return {
                            format: 'must specify to and from parameters'
                        }
                    }
                    
                    if (!(/^\+?\d+$/).test(callTo) || !(/^\+?\d+$/).test(callFrom)) {
                        return {
                            format: 'must not contain invalid phone numbers'
                        }
                    }

                };

                return null;

            }
        };

        let error = validate(options, constraints);
        if (error) {
            // TODO should this be rejected by promise instead?
            throw error;
        }
    }

    _validateParams();

    return new Promise(function (resolve, reject) {

        let body = {
            username: _self.options.username,
            to: JSON.stringify(options.callTo),
            from: JSON.stringify(options.callFrom)
        };

        let rq = unirest.post(Common.VOICE_URL + '/call');
        rq.headers({
            apiKey: _self.options.apiKey,
            Accept: _self.options.format
        });

        rq.send(body);

        rq.end(function (resp) {
            if (resp.status === 201) {
                // API returns CREATED on success
                resolve(resp.body);
            } else {
                reject(resp.error || resp.body);
            }
        });
        
        
    });
    
};





// getNumQueuedCalls
Voice.prototype.getNumQueuedCalls = function (params) {
    
    let options = _.cloneDeep(params);
    let _self = this;
    
    // Validate params
    let _validateParams = function () {
        
        var constraints = {
            phoneNumber: function (value) {
                
                if (validate.isEmpty(value)) {
                    return {
                        presence: {
                            message: 'is required'
                        }
                    };
                }
                
                for(let i in value){
                    let phoneNumber = value[i];
                    let phone = phoneNumber.phoneNumber;
                    
                    if (validate.isEmpty(phone)) {
                        
                        return {
                            format: 'must specify a virtual phoneNumber'
                        }
                    }
                    
                    if (!(/^\+?\d+$/).test(phone)) {
                        return {
                            format: 'must not contain invalid phone numbers'
                        }
                    }
                    
                };
                
                return null;
               
            }
        };
        
        let error = validate(options, constraints);
        if (error) {
            // TODO should this be rejected by promise instead?
            throw error;
        }
    }
    
    _validateParams();
    
    return new Promise(function (resolve, reject) {
        // list of phoneNumbers, comma separated
        let body = {
            username: _self.options.username,
            phoneNumbers: JSON.stringify(options.phoneNumber)
        };
        
        let rq = unirest.post(Common.VOICE_URL + '/queueStatus');
        rq.headers({
            apiKey: _self.options.apiKey,
            Accept: _self.options.format
        });
        
        rq.send(body);
        
        rq.end(function (resp) {
            if (resp.status === 201) {
                // API returns CREATED on success
                resolve(resp.body);
            } else {
                reject(resp.error || resp.body);
            }
        });
        
        
    });
    
};

module.exports = Voice;
