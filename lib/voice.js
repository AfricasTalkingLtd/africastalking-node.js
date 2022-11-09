'use strict';

const unirest = require('unirest');
const validate = require('validate.js');
const _ = require('lodash');
const { phone: phoneValidator } = require('phone');

const Common = require('./common');
const Builder = require('./actionbuilder')

class Voice {
    constructor(options) {
        this.options = options;
        this.ActionBuilder = Builder;
    }
    call({callFrom, callTo, clientRequestId}){
        return new Promise((resolve,reject)=>{
            if(!callTo || !callFrom){
                reject(`Both "callTo" and "callFrom" are required`)
            };

            if(typeof callTo === 'string'){
                callTo = callTo.split(',');
            };

            if(!Array.isArray(callTo)){
                reject('"callTo" can only be an array of phoneNumbers, or a string of comma-separated phoneNumbers');
            };

            const constraints = {
                clientRequestId: {
                    isString: true,
                },
                callFrom:function (value) {
                    const suspect = phoneValidator(value);
                    if(suspect.isValid){
                        callFrom = suspect.phoneNumber;
                        return null;
                    }else{
                        return { format: "callFrom must be a valid phonenumber" }
                    };
                },
                callTo: function(value){
                    const invalidPhoneNumbers = [];
                    const validPhoneNumbers = [];

                    value.forEach(function (phoneNumber) {
                        const suspect = phoneValidator(phoneNumber);
                        if(suspect.isValid){
                            validPhoneNumbers.push(suspect.phoneNumber)
                        }else{
                            invalidPhoneNumbers.push(phoneNumber);
                        };
                    });

                    if(invalidPhoneNumbers.length){
                        return {
                            format: `callTo contains the following invalid phoneNumber(s): ${invalidPhoneNumbers}`
                        }
                    }else{
                        callTo = validPhoneNumbers;
                        return null;
                    }
                }
            };

            const error = validate({callFrom, callTo, clientRequestId}, constraints);
            
            if (error) {
                let msg = "";
                for (var k in error) {
                    msg += error[k] + "; ";
                };
                reject(msg); 
            }else{
                const body = {
                    username: this.options.username,
                    to: callTo.join(','),
                    from: callFrom,
                    clientRequestId: clientRequestId
                };

                const rq = unirest.post(Common.VOICE_URL + '/call');
                rq.headers({
                    apikey: this.options.apiKey,
                    Accept: this.options.format
                });
    
                rq.send(body);
    
                rq.end(function (resp) {
                    if (resp.status === 200 || resp.status === 201) {
                        // API returns CREATED on success
                        resolve(resp.body);
                    } else {
                        reject(resp.body || resp.error);
                    };
                });
            };
        })
    }
    getNumQueuedCalls(params) {

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
        };

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
            });
        });
    }
    uploadMediaFile(params) {
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
                        };
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
    }
}

module.exports = Voice;
