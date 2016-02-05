'use strict'

var Promise = require('bluebird');
var unirest = require('unirest');
var validate = require('validate.js');
var _ = require('lodash');

var Common = require('./common');

function Airtime(options) {
   
    this.options = options;
    
}

Airtime.prototype.send = function (options) {
    
    
    return new Promise(function (resolve, reject) {
        
        var body = {
            username: this.options.username,
            recipients: JSON.stringify(options.recipients)
        };
        
        var rq = unirest.post(Common.AIRTIME_URL);
        rq.headers({
            apiKey: this.options.apiKey,
            Accept: this.options.format
        });
        rq.send(body);
        
        rq.send(function (resp) {
            if (resp.status === 201) {
                // API returns CREATED on success
                resolve(resp.body);
            } else {
                reject(resp.error || resp.body);
            }
        });
        
        
    });
    
};

module.exports = Airtime;