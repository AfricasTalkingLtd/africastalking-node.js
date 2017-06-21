'use strict';

var Promise  = require('bluebird');
var unirest  = require('unirest');
var validate = require('validate.js');
var _        = require('lodash');

var Common   = require('./common');


function Payments(options) {
    this.options = options;

    this.REASON = {
        SALARY: 'SalaryPayment',
        SALARY_WITH_CHARGE: 'SalaryPaymentWithWithdrawalChargePaid',
        BUSINESS: 'BusinessPayment',
        BUSINESS_WITH_CHARGE: 'BusinessPaymentWithWithdrawalChargePaid',
        PROMOTION: 'PromotionPayment'
    };
    this.PROVIDER = {
        ATHENA: 'Athena',
        MPESA: 'Mpesa',
    };
    this.TRANSFER_TYPE = {
      BUY_GOODS : 'BusinessBuyGoods',
      PAYBILL : 'BusinessPayBill',
      DISBURSE_FUNDS : 'DisburseFundsToBusiness',
      B2B_TRANSFER : 'BusinessToBusinessTransfer'
    };
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
            username        : _self.options.username,
            productName     : options.productName,
            phoneNumber     : options.phoneNumber,
            currencyCode    : options.currencyCode,
            providerChannel : options.providerChannel,
            amount          : options.amount,
            metadata        : options.metadata
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


Payments.prototype.payConsumer = function (params) {

    let options = _.cloneDeep(params);
    let _self   = this;
    let validationError;

    // Validate params
    let _validateParams = function () {

        let paramsConstraints = {
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
            recipients:{
                presence: true,
                length: function(value, attributes, attributeName, options, constraints) {
                    if (validate.isArray(value)) {
                        return value.length >= 1 && value.length <= 10;
                    }
                    return false;
                }
            }
        };

        let recipientsConstraints = {
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

            reason: function(value) {

                if (value) {
                    switch (value) {
                        case _self.REASON.SALARY:
                        case _self.REASON.SALARY_WITH_CHARGE:
                        case _self.REASON.BUSINESS_WITH_CHARGE:
                        case _self.REASON.BUSINESS:
                        case _self.REASON.PROMOTION:
                            break;
                        default:
                            return {
                                format: 'reason has to be one of payments.REASON.*'
                            }
                    }
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

        let error = validate(options, paramsConstraints);
        let makeErrorMessage = function (error) {
            var msg = "";
            for (var k in error) {
                msg += error[k] + "; ";
            }
            validationError = new Error(msg);
        };
        if (!error) {
            // Validate each recipient
            for(let i = 0; i < options.recipients.length; i++) {
                error = validate(options.recipients[i], recipientsConstraints);
                if (error){
                    makeErrorMessage(error);
                    break;
                }
            }
        }

    };

    _validateParams();

    return new Promise(function (resolve, reject) {

        if (validationError) {
            return reject(validationError);
        }

        let body = {
            username     : _self.options.username,
            productName  : options.productName,
            recipients  : options.recipients
        };

        let rq = unirest.post(Common.MOBILE_PAYMENT_URL + '/mobile/b2c/request');
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

Payments.prototype.payBusiness = function (params) {

    const options = _.cloneDeep(params);
    const _self   = this;
    let validationError;

    // Validate params
    const _validateParams = function () {

        const paramsConstraints = {
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

            provider: function (value) {

                if (validate.isEmpty(value)) {
                    return {
                        presence: {
                            message: 'is required'
                        }
                    };
                }
                if (value) {
                    switch (value) {
                        case _self.PROVIDER.ATHENA:
                        case _self.PROVIDER.MPESA:
                            break;
                        default:
                            return {
                                format: 'provider has to be one of payments.PROVIDER.*'
                            }
                    }
                }

                return null;
            },

            transferType: function (value) {

                if (validate.isEmpty(value)) {
                    return {
                        presence: {
                            message: 'is required'
                        }
                    };
                }
                if (value) {
                    switch (value) {
                        case _self.TRANSFER_TYPE.BUY_GOODS:
                        case _self.TRANSFER_TYPE.PAYBILL:
                        case _self.TRANSFER_TYPE.DISBURSE_FUNDS:
                        case _self.TRANSFER_TYPE.B2B_TRANSFER:
                            break;
                        default:
                            return {
                                format: 'transferType has to be one of payments.TRANSFER_TYPE.*'
                            }
                    }
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
            },

            destinationAccount:  function (value) {

              if (validate.isEmpty(value)) {
                return {
                    presence: {
                        message: 'is required'
                    }
                };
              }

              return null;
            },

            destinationChannel:  function (value) {

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

        };

        const error = validate(options, paramsConstraints);

        const makeErrorMessage = function (error) {
            var msg = "";
            for (var k in error) {
                msg += error[k] + "; ";
            }
            validationError = new Error(msg);
        }

        if (error) {
          makeErrorMessage(error);
        }

    };

    _validateParams();

    return new Promise(function (resolve, reject) {

        if (validationError) {
            return reject(validationError);
        }

        const { username, apiKey, format } = _self.options;
        const { productName, provider, transferType, currencyCode, amount, destinationAccount, destinationChannel, metadata } = options;

        const body = {
            username,
            productName,
            provider,
            transferType,
            currencyCode,
            amount,
            destinationAccount,
            destinationChannel,
            metadata
        };

        const rq = unirest.post(Common.MOBILE_PAYMENT_URL + '/mobile/b2b/request');

        rq.headers({
            apikey: apiKey,
            Accept: format,
            'Content-Type': 'application/json'
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

module.exports = Payments;
