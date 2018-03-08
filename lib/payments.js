'use strict';

const unirest  = require('unirest');
const validate = require('validate.js');
const _        = require('lodash');

const Common   = require('./common');


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

    this.BANK = {
      FCMB_NG: 234001,
      ZENITH_NG: 234002,
      ACCESS_NG: 234003,
      GTBANK_NG: 234004,
      ECOBANK_NG: 234005,
      DIAMOND_NG: 234006,
      PROVIDUS_NG: 234007,
      UNITY_NG: 234008,
      STANBIC_NG: 234009,
      STERLING_NG: 234010,
      PARKWAY_NG: 234011,
      AFRIBANK_NG: 234012,
      ENTREPRISE_NG: 234013,
      FIDELITY_NG: 234014,
      HERITAGE_NG: 234015,
      KEYSTONE_NG: 234016,
      SKYE_NG: 234017,
      STANCHART_NG: 234018,
      UNION_NG: 234019,
      UBA_NG: 234020,
      WEMA_NG: 234021,
      FIRST_NG: 234022,
    };
}

Payments.prototype.mobileCheckout = function (params) {

    let options = _.cloneDeep(params);
    let _self   = this;
    let validationError;

    // Validate params
    let _validateParams = function () {

        const constraints = {
          phoneNumber: function (value) {

            if (validate.isEmpty(value)) {
              return {
                presence: {
                  message: 'is required'
                }
              };
            }
            
            if (!(/^\+\d{1,3}\d{3,}$/).test(value)) {
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
          let msg = "";
          for (let k in error) {
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


        let rq = unirest.post(Common.PAYMENT_URL + '/mobile/checkout/request');
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

/* For backward compatibility */
Payments.prototype.checkOut = Payments.prototype.mobileCheckout;
Payments.prototype.checkout = Payments.prototype.mobileCheckout;
/* End */

Payments.prototype.mobileB2C = function (params) {

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
            let msg = "";
            for (let k in error) {
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

        let rq = unirest.post(Common.PAYMENT_URL + '/mobile/b2c/request');
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

Payments.prototype.payConsumer = Payments.prototype.mobileB2C;

Payments.prototype.mobileB2B = function (params) {

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
            let msg = "";
            for (let k in error) {
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

        const rq = unirest.post(Common.PAYMENT_URL + '/mobile/b2b/request');

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

Payments.prototype.payBusiness = Payments.prototype.mobileB2B;

Payments.prototype.bankCheckout = function (params) {

    const options = _.cloneDeep(params);
    const _self = this;
    let validationError;

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

            bankAccont: function(value) {
                if (!validate.isObject(value)) {
                    return {
                        format: 'bankAccount needs to be a string map; i.e. {"accountName":"value", "accountNumber":"otherValue","bankCode":0000}'
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

            narration: function(value) {
                if (!(/\S/).test(value)) {
                    return {
                        format: 'must not contain invalid narration - eg. Space'
                    };
                }

                return null;
            },

            metadata: function(value) {
                if (value && !validate.isObject(value)) {
                    return {
                        format: 'metadata need to be a string map; i.e. {"key":"value", "otherKey":"otherValue"}'
                    };
                }
                return null;
            },
        };

        const error = validate(options, paramsConstraints);

        const makeErrorMessage = function (error) {
            let msg = "";
            for (let k in error) {
                msg += error[k] + "; ";
            }
            validationError = new Error(msg);
        }

        if (error) {
          makeErrorMessage(error);
        }
    }

    _validateParams();

    return new Promise(function (resolve, reject) {
        if (validationError) {
            return reject(validationError);
        }

        const { username, apiKey, format } = _self.options;
        const { productName, bankAccount, currencyCode,
        amount, narration, metadata } = options;

        const body = {
            username,
            productName,
            bankAccount,
            currencyCode,
            amount,
            narration,
            metadata,
        };

        const rq = unirest.post(Common.PAYMENT_URL + '/bank/checkout/charge');

        rq.headers({
            apiKey: apiKey,
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

Payments.prototype.validateBankCheckout = function (params) {
    const options = _.cloneDeep(params);
    const _self = this;
    let validationError;

    const _validateParams = function () {
        const paramsConstraints = {
            transactionId: function(value) {
                if (!(/\S/).test(value)) {
                    return {
                        format: 'must not contain invalid transactionId - eg. Space'
                    };
                }

                return null;
            },

            otp: function(value) {
                if (!(/\S/).test(value)) {
                    return {
                        format: 'must not contain invalid otp - eg. Space'
                    };
                }

                return null;
            },
        };

        const error = validate(options, paramsConstraints);

        const makeErrorMessage = function (error) {
            let msg = "";
            for (let k in error) {
                msg += error[k] + "; ";
            }
            validationError = new Error(msg);
        }

        if (error) {
          makeErrorMessage(error);
        }
    }

    _validateParams();

    return new Promise(function (resolve, reject) {
        if (validationError) {
            return reject(validationError);
        }

        const { username, apiKey, format } = _self.options;
        const { transactionId, otp } = options;

        const body  = {
            username,
            transactionId,
            otp,
        };

        const rq = unirest.post(Common.PAYMENT_URL + '/bank/checkout/validate');

        rq.headers({
            apiKey: apiKey,
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

Payments.prototype.bankTransfer = function (params) {
    const options = _.cloneDeep(params);
    const _self = this;
    let validationError;

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
            recipients: function (value) {
                if (validate.isEmpty(value)) {
                    return {
                        presence: {
                            message: 'is required'
                        }
                    };
                }
                if (validate.isArray(value)) {
                    return {
                        format: 'must be an array'
                    };
                }
                return null;
            }
        };

        const recipientsConstraints = {
            bankAccont: function(value) {
                if (!validate.isObject(value)) {
                    return {
                        format: 'bankAccount needs to be a string map; i.e. {"accountName":"value", "accountNumber":"otherValue","bankCode":0000}'
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

            narration: function(value) {
                if (!(/\S/).test(value)) {
                    return {
                        format: 'must not contain invalid narration - eg. Space'
                    };
                }
                return null;
            },

            metadata: function(value) {
                if (value && !validate.isObject(value)) {
                    return {
                        format: 'metadata need to be a string map; i.e. {"key":"value", "otherKey":"otherValue"}'
                    };
                }
                return null;
            },
        };

        let error = validate(options, paramsConstraints);
        let makeErrorMessage = function (error) {
            let msg = "";
            for (let k in error) {
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
    }

    _validateParams();

    return new Promise(function (resolve, reject) {
        if (validationError) {
            return reject(validationError);
        }

        const { username, apiKey, format } = _self.options;
        const { productName, recipients } = options;

        const body = {
            username,
            productName,
            recipients,
        };

        const rq = unirest.post(Common.PAYMENT_URL + '/bank/transfer');

        rq.headers({
            apiKey: apiKey,
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

Payments.prototype.cardCheckout = function (params) {
    const options = _.cloneDeep(params);
    const _self = this;
    let validationError;

    const _cardCheckoutWithToken = function () {
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

                checkoutToken: function(value) {
                    if (value && !(/\S/).test(value)) {
                        return {
                            format: 'must not contain invalid checkoutToken - eg. Space'
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

                narration: function(value) {
                    if (!(/\S/).test(value)) {
                        return {
                            format: 'must not contain invalid narration - eg. Space'
                        };
                    }
                    return null;
                },

                metadata: function(value) {
                    if (value && !validate.isObject(value)) {
                        return {
                            format: 'metadata need to be a string map; i.e. {"key":"value", "otherKey":"otherValue"}'
                        };
                    }
                    return null;
                },
            };

            const error = validate(options, paramsConstraints);

            const makeErrorMessage = function (error) {
                let msg = "";
                for (let k in error) {
                    msg += error[k] + "; ";
                }
                validationError = new Error(msg);
            }

            if (error) {
              makeErrorMessage(error);
            }
        }

        _validateParams();

        return new Promise(function (resolve, reject) {
            if (validationError) {
                return reject(validationError);
            }

            const { username, apiKey, format } = _self.options;
            const { productName, checkoutToken, currencyCode,
            amount, narration, metadata } = options;
    
            const body  = {
                username,
                productName,
                checkoutToken,
                currencyCode,
                amount,
                narration,
                metadata,
            };
    
            const rq = unirest.post(Common.PAYMENT_URL + '/card/checkout/charge');
    
            rq.headers({
                apiKey: apiKey,
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
    }

    const _cardCheckoutWithPaymentCard = function () {
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

                paymentCard: function(value) {
                    if (!validate.isObject(value)) {
                        return {
                            format: 'paymentCard needs to be a string map; i.e. {number: "Number", cvvNumber: 000,expiryMonth: 7,expiryYear: 2019,authToken: "2345",countryCode: "234"}'
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

                narration: function(value) {
                    if (!(/\S/).test(value)) {
                        return {
                            format: 'must not contain invalid narration - eg. Space'
                        };
                    }
                    return null;
                },

                metadata: function(value) {
                    if (value && !validate.isObject(value)) {
                        return {
                            format: 'metadata need to be a string map; i.e. {"key":"value", "otherKey":"otherValue"}'
                        };
                    }
                    return null;
                },
            };

            const error = validate(options, paramsConstraints);

            const makeErrorMessage = function (error) {
                let msg = "";
                for (let k in error) {
                    msg += error[k] + "; ";
                }
                validationError = new Error(msg);
            }

            if (error) {
              makeErrorMessage(error);
            }
        }

        _validateParams();

        return new Promise(function (resolve, reject) {
            if (validationError) {
                return reject(validationError);
            }

            const { username, apiKey, format } = _self.options;
            const { productName, paymentCard, currencyCode,
            amount, narration, metadata } = options;

            const body = {
                username,
                productName,
                paymentCard,
                currencyCode,
                amount,
                narration,
                metadata,
            };

            const rq = unirest.post(Common.PAYMENT_URL + '/card/checkout/charge');

            rq.headers({
                apiKey: apiKey,
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
    }

    if (options.checkoutToken !== undefined) {
        return _cardCheckoutWithToken();
    }

    return _cardCheckoutWithPaymentCard();
};

Payments.prototype.validateCardCheckout = function (params) {
    const options = _.cloneDeep(params);
    const _self = this;
    let validationError;

    const _validateParams = function () {
        const paramsConstraints = {
            transactionId: function(value) {
                if (!(/\S/).test(value)) {
                    return {
                        format: 'must not contain invalid transactionId - eg. Space'
                    };
                }
                return null;
            },

            otp: function(value) {
                if (!(/\S/).test(value)) {
                    return {
                        format: 'must not contain invalid otp - eg. Space'
                    };
                }
                return null;
            },
        };

        const error = validate(options, paramsConstraints);

        const makeErrorMessage = function (error) {
            let msg = "";
            for (let k in error) {
                msg += error[k] + "; ";
            }
            validationError = new Error(msg);
        }

        if (error) {
          makeErrorMessage(error);
        }
    }

    _validateParams();

    return new Promise(function (resolve, reject) {
        if (validationError) {
            return reject(validationError);
        }

        const { username, apiKey, format } = _self.options;
        const { transactionId, otp } = options;

        const body  = {
            username,
            transactionId,
            otp,
        };

        const rq = unirest.post(Common.PAYMENT_URL + '/card/checkout/validate');

        rq.headers({
            apiKey: apiKey,
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
