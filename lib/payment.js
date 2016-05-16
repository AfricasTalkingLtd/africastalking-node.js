'use strict';

var Promise  = require('bluebird');
var unirest  = require('unirest');
var validate = require('validate.js');
var _        = require('lodash');

var Common   = require('./common');


function Payment(options) {
  this.options = options;
}


Payment.prototype.checkOut = function (params) {
 
  let options = _.cloneDeep(params);
  let _self   = this;

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

        metadata: function (value) {

          if (validate.isEmpty(value)) {
            return {
                presence: {
                    message: 'is required'
                }
            };
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

    let body = {
      username     : _self.options.username,
      productName  : options.productName,
      phoneNumber  : options.phoneNumber,
      currencyCode : options.currencyCode,
      amount       : options.amount,
      metadata     : options.metadata
    };
    console.log(body);

    let rq = unirest.post(Common.MOBILE_PAYMENT_URL + '/checkout/v1');
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


module.exports = Payment;
