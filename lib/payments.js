'use strict';

var Promise  = require('bluebird');
var unirest  = require('unirest');
var validate = require('validate.js');
var _        = require('lodash');

var Common   = require('./common');


function Payments(options) {
    this.options = options;
}

Payments.prototype.checkout = function (params) {

    let options = _.cloneDeep(params);
    let _self   = this;
    let validationError;

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
            if (!(/^\+?\d+$/).test(value)) {
              return {
                  format: 'must not contain invalid phone number'
              };
            }

            return null;
          },

          productName: function (value) {

            if (validate.isEmpty(value)) {
              return {
                  presence: {
                      message: 'is required'
                  }
              };
            }
            if (!(/\S/).test(value)) {
              return {
                  format: 'must not contain invalid productName - eg. Space'
              };
            }

            return null;
          },

          currencyCode: function (value) {

            if (validate.isEmpty(value)) {
              return {
                  presence: {
                      message: 'is required'
                  }
              };
            }

            return null;
          },

          metadata: function(value) {
              if (value && !validate.isObject(value)) {
                  return { format: 'metadata need to be a string map; i.e. {"key":"value", "otherKey":"otherValue"}'};
              }
              return null;
          },

          amount: function (value) {

            if (validate.isEmpty(value)) {
              return {
                  presence: {
                      message: 'is required'
                  }
              };
            }
            if (!validate.isNumber(value)) {
              return {
                  format: 'must not contain invalid amount. Must be a number.'
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

          validationError = new Error(msg);
        }
    }

    _validateParams();

    return new Promise(function (resolve, reject) {

        if (validationError) {
            return reject(validationError);
        }

        let body = {
            username     : _self.options.username,
            productName  : options.productName,
            phoneNumber  : options.phoneNumber,
            currencyCode : options.currencyCode,
            amount       : options.amount,
            metadata     : options.metadata
        };


        let rq = unirest.post(Common.MOBILE_PAYMENT_URL + '/mobile/checkout/request');
        rq.headers({
            apikey       : _self.options.apiKey,
            Accept       : _self.options.format,
            'Content-Type' : 'application/json'
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

Payments.prototype.checkOut = Payments.prototype.checkout; // For backward compatibility

module.exports = Payments;
