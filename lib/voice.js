'use strict';
const validate = require('validate.js');
const _ = require('lodash');
const axios = require('axios');
const { phoneValidator } = require('./utils');

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

                const config = {
                    method: 'post',
                    url: `${Common.VOICE_URL}/call`,
                    headers: {
                        apikey: this.options.apiKey,
                        Accept: this.options.format,
                        "Content-Type":"application/x-www-form-urlencoded"
                    },
                    data : new URLSearchParams({
                        username: this.options.username,
                        to: callTo.join(','),
                        from: callFrom,
                        clientRequestId: clientRequestId
                    
                    })
                };
                axios(config)
                .then(function (resp) {
                    const httpStatus = resp.status;

                    if (httpStatus === 200 || httpStatus === 201) {
                        // API returns CREATED on success
                        resolve(resp.data);
                    } else {
                        reject(resp.data);
                    };
                })
                .catch(function (error) {
                    return reject(error);
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
            const config = {
                method: 'post',
                url: `${Common.VOICE_URL}/queueStatus`,
                headers: {
                    apikey: _self.options.apiKey,
                    Accept: _self.options.format
                },
                data : JSON.stringify({
                    username: _self.options.username,
                    phoneNumbers: options.phoneNumbers
                
                })
            };
            axios(config)
            .then(function (resp) {
                const httpStatus = resp.status;

                if (httpStatus === 200 || httpStatus === 201) {
                    // API returns CREATED on success
                    resolve(resp.data);
                } else {
                    reject(resp.data);
                };
            })
            .catch(function (error) {
                return reject(error);
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
            const config = {
                method: 'post',
                url: `${Common.VOICE_URL}/mediaUpload`,
                headers: {
                    
                apikey: _self.options.apiKey,
                Accept: _self.options.format
                },
                data : JSON.stringify({
                    username: _self.options.username,
                    url: options.url,
                    phoneNumber: options.phoneNumber
                
                })
            };

            axios(config)
            .then(function (resp) {
                const httpStatus = resp.status;

                if (httpStatus === 200 || httpStatus === 201) {
                    // API returns CREATED on success
                    resolve(resp.data);
                } else {
                    reject(resp.data);
                };
            })
            .catch(function (error) {
                return reject(error);
            });
        });
    }
}

module.exports = Voice;
