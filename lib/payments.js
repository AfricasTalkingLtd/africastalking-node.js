'use strict';

const axios = require('axios');
const validate = require('validate.js');
const _ = require('lodash');

const Common = require('./common');


class Payments {
    constructor(options) {
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
            BUY_GOODS: 'BusinessBuyGoods',
            PAYBILL: 'BusinessPayBill',
            DISBURSE_FUNDS: 'DisburseFundsToBusiness',
            B2B_TRANSFER: 'BusinessToBusinessTransfer'
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
    mobileCheckout(params) {

        let options = _.cloneDeep(params);
        let _self = this;
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

                metadata: function (value) {
                    if (value && !validate.isObject(value)) {
                        return {
                            format: 'metadata need to be a string map; i.e. {"key":"value", "otherKey":"otherValue"}'
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
                let msg = "";
                for (let k in error) {
                    msg += error[k] + "; ";
                }

                validationError = new Error(msg);
            }
        };

        _validateParams();

        return new Promise(function (resolve, reject) {

            if (validationError) {
                return reject(validationError);
            }

            let body = {
                username: _self.options.username,
                productName: options.productName,
                phoneNumber: options.phoneNumber,
                currencyCode: options.currencyCode,
                providerChannel: options.providerChannel,
                amount: options.amount,
                metadata: options.metadata
            };

            let url = `${Common.PAYMENT_URL}/mobile/checkout/request`;
           
            let headers = {
                apikey: _self.options.apiKey,
                Accept: _self.options.format,
                'Content-Type': 'application/json'
            };

            axios({
                method:'POST',
                url,
                headers,
                data: body
            })
            .then(function (response) {
                if (response.status === 201) {
                    // API returns CREATED on success
                    resolve(response.data);
                } else {
                  reject(response.data);
                }
            })
            .catch(function (error) {
                reject(error)
            });
        });
    }

    /* End */
    mobileB2C(params) {

        let options = _.cloneDeep(params);
        let _self = this;
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
                recipients: {
                    presence: true,
                    length: function (value, attributes, attributeName, options, constraints) {
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

                providerChannel: function (value) {
                    if (value && !validate.isString(value)) {
                        return {
                            presence: {
                                format: 'providerChannel must be a string'
                            }
                        };
                    }

                    return null;
                },

                metadata: function (value) {
                    if (value && !validate.isObject(value)) {
                        return {
                            format: 'metadata need to be a string map; i.e. {"key":"value", "otherKey":"otherValue"}'
                        };
                    }
                    return null;
                },

                reason: function (value) {

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
                                };
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
                for (let i = 0; i < options.recipients.length; i++) {
                    error = validate(options.recipients[i], recipientsConstraints);
                    if (error) {
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
                username: _self.options.username,
                productName: options.productName,
                recipients: options.recipients
            };
            
            let headers = {
                apikey: _self.options.apiKey,
                Accept: _self.options.format,
                'Content-Type': 'application/json'
            };

            let url = `${Common.PAYMENT_URL}/mobile/b2c/request`;
        
            axios({
                method:'POST',
                url,
                headers,
                data: body
              })
              .then(function (response) {   
                if (response.status === 201) {
                    // API returns CREATED on success
                  resolve(response.data);
                } else {
                  reject(response.data);
                }
              })
              .catch(function (error) {
                reject(error)
              });
        });

    }
    mobileB2B(params) {

        const options = _.cloneDeep(params);
        const _self = this;
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
                                };
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
                                };
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

                destinationAccount: function (value) {

                    if (validate.isEmpty(value)) {
                        return {
                            presence: {
                                message: 'is required'
                            }
                        };
                    }

                    return null;
                },

                destinationChannel: function (value) {

                    if (validate.isEmpty(value)) {
                        return {
                            presence: {
                                message: 'is required'
                            }
                        };
                    }

                    return null;
                },

                requester: function (value) {
                    if (value && !(/^\+?\d+$/).test(value)) {
                        return {
                            format: 'must not contain invalid phone number'
                        };
                    }
                    return null;
                },

                metadata: function (value) {
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
            };

            if (error) {
                makeErrorMessage(error);
            }

        };

        _validateParams();

        return new Promise(function (resolve, reject) {

            if (validationError) {
                return reject(validationError);
            }

            const {
                username, apiKey, format
            } = _self.options;
            const {
                productName, provider, transferType, currencyCode, amount, destinationAccount, destinationChannel, requester, metadata
            } = options;

            const body = {
                username,
                productName,
                provider,
                transferType,
                currencyCode,
                amount,
                destinationAccount,
                destinationChannel,
                requester,
                metadata
            };

            const headers = {
                apikey: apiKey,
                Accept: format,
                'Content-Type': 'application/json'
            };

            const url = `${Common.PAYMENT_URL}/mobile/b2b/request`

            axios({
                method:'POST',
                url,
                headers,
                data: body
              })
              .then(function (response) {   
                if (response.status === 201) {
                    // API returns CREATED on success
                  resolve(response.data);
                } else {
                  reject(response.data);
                }
              })
              .catch(function (error) {
                reject(error)
              });
        });

    }
    bankCheckoutCharge(params) {

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

                bankAccont: function (value) {
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

                narration: function (value) {
                    if (!(/\S/).test(value)) {
                        return {
                            format: 'must not contain invalid narration - eg. Space'
                        };
                    }

                    return null;
                },

                metadata: function (value) {
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
            };

            if (error) {
                makeErrorMessage(error);
            }
        };

        _validateParams();

        return new Promise(function (resolve, reject) {
            if (validationError) {
                return reject(validationError);
            }

            const {
                username, apiKey, format
            } = _self.options;
            const {
                productName, bankAccount, currencyCode, amount, narration, metadata
            } = options;

            const body = {
                username,
                productName,
                bankAccount,
                currencyCode,
                amount,
                narration,
                metadata,
            };

            const headers = {
                apiKey: apiKey,
                Accept: format,
                'Content-Type': 'application/json'
            }
        
            const url = `${Common.PAYMENT_URL}/bank/checkout/charge`;

            axios({
                method:'POST',
                url,
                headers,
                data: body
              })
              .then(function (response) {   
                if (response.status === 201) {
                    // API returns CREATED on success
                  resolve(response.data);
                } else {
                  reject(response.data);
                }
              })
              .catch(function (error) {
                reject(error)
              });
        });
    }
    bankCheckoutValidate(params) {
        const options = _.cloneDeep(params);
        const _self = this;
        let validationError;

        const _validateParams = function () {
            const paramsConstraints = {
                transactionId: function (value) {
                    if (!(/\S/).test(value)) {
                        return {
                            format: 'must not contain invalid transactionId - eg. Space'
                        };
                    }

                    return null;
                },

                otp: function (value) {
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
            };

            if (error) {
                makeErrorMessage(error);
            }
        };

        _validateParams();

        return new Promise(function (resolve, reject) {
            if (validationError) {
                return reject(validationError);
            }

            const {
                username, apiKey, format
            } = _self.options;
            const {
                transactionId, otp
            } = options;

            const body = {
                username,
                transactionId,
                otp,
            };

            const url = `${Common.PAYMENT_URL}/bank/checkout/validate`;
            const headers = {
                    apiKey: apiKey,
                    Accept: format,
                    'Content-Type': 'application/json'
                };

            axios({
                method:'POST',
                url,
                headers,
                data: body
              })
              .then(function (response) {   
                if (response.status === 201) {
                    // API returns CREATED on success
                  resolve(response.data);
                } else {
                  reject(response.data);
                }
              })
              .catch(function (error) {
                reject(error)
              });
              
        });
    }
    mobileData(params) {
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

                quantity: function (value) {
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

                unit: function (value) {
                    if (validate.isEmpty(value)) {
                        return {
                            presence: {
                                message: 'is required'
                            }
                        };
                    }
                    let dataUnits = ['MB', 'GB'];
                    if (!dataUnits.includes(value)) {
                        return {
                            format: 'must contain valid data units.'
                        };
                    }
                    return null;
                },

                validity: function (value) {
                    if (validate.isEmpty(value)) {
                        return {
                            presence: {
                                message: 'is required'
                            }
                        };
                    }
                    let dataValidity = ['Day', 'Month', 'Week'];
                    if (!dataValidity.includes(value)) {
                        return {
                            format: 'must contain valid data validity periods.'
                        };
                    }
                    return null;
                },

                metadata: function (value) {
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
                for (let i = 0; i < options.recipients.length; i++) {
                    error = validate(options.recipients[i], recipientsConstraints);
                    if (error) {
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

            const {
                username, apiKey, format
            } = _self.options;
            const {
                productName, recipients
            } = options;

            const body = {
                username,
                productName,
                recipients,
            };
            const headers = {
                apiKey: apiKey,
                Accept: format,
                'Content-Type': 'application/json'
            }

            const url = `${Common.PAYMENT_URL}/mobile/data/request`;

            axios({
                method:'POST',
                url,
                headers,
                data: body
              })
              .then(function (response) {   
                if (response.status === 201) {
                    // API returns CREATED on success
                  resolve(response.data);
                } else {
                  reject(response.data);
                }
              })
              .catch(function (error) {
                reject(error)
              });
              
        });
    }
    bankTransfer(params) {
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
                bankAccont: function (value) {
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

                narration: function (value) {
                    if (!(/\S/).test(value)) {
                        return {
                            format: 'must not contain invalid narration - eg. Space'
                        };
                    }
                    return null;
                },

                metadata: function (value) {
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
                for (let i = 0; i < options.recipients.length; i++) {
                    error = validate(options.recipients[i], recipientsConstraints);
                    if (error) {
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

            const {
                username, apiKey, format
            } = _self.options;
            const {
                productName, recipients
            } = options;

            const body = {
                username,
                productName,
                recipients,
            };

            const headers = {
                apiKey: apiKey,
                Accept: format,
                'Content-Type': 'application/json'
            }

            const url = `${Common.PAYMENT_URL}/bank/transfer`;

            axios({
                method:'POST',
                url,
                headers,
                data: body
              })
              .then(function (response) {   
                if (response.status === 201) {
                    // API returns CREATED on success
                  resolve(response.data);
                } else {
                  reject(response.data);
                }
              })
              .catch(function (error) {
                reject(error)
              });

        });
    }
    walletTransfer(params) {
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


                metadata: function (value) {
                    if (!validate.isObject(value)) {
                        return {
                            format: 'metadata need to be a string map; i.e. {"key":"value", "otherKey":"otherValue"}'
                        };
                    }
                    return null;
                },

                targetProductCode: function (value) {
                    if (validate.isEmpty(value)) {
                        return {
                            presence: {
                                message: 'is required'
                            }
                        };
                    }
                    if (!validate.isNumber(value)) {
                        return {
                            format: 'must not contain invalid targetProductCode. Must be a number.'
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
            if (error) {
                makeErrorMessage(error);
            }
        };

        _validateParams();

        return new Promise(function (resolve, reject) {
            if (validationError) {
                return reject(validationError);
            }

            const {
                username, apiKey, format
            } = _self.options;

            const body = _.merge({ username }, options);

            const headers = {
                apiKey: apiKey,
                Accept: format,
                'Content-Type': 'application/json'
            };

            const url = `${Common.PAYMENT_URL}/transfer/wallet`;

            axios({
                method:'POST',
                url,
                headers,
                data: body
              })
              .then(function (response) {   
                if (response.status === 201) {
                    // API returns CREATED on success
                  resolve(response.data);
                } else {
                  reject(response.data);
                }
              })
              .catch(function (error) {
                reject(error)
              });
        });
    }
    topupStash(params) {
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


                metadata: function (value) {
                    if (!validate.isObject(value)) {
                        return {
                            format: 'metadata need to be a string map; i.e. {"key":"value", "otherKey":"otherValue"}'
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
            if (error) {
                makeErrorMessage(error);
            }
        };

        _validateParams();

        return new Promise(function (resolve, reject) {
            if (validationError) {
                return reject(validationError);
            }

            const {
                username, apiKey, format
            } = _self.options;

            const body = _.merge({ username }, options);

            const headers = {
                apiKey: apiKey,
                Accept: format,
                'Content-Type': 'application/json'
            };

            const url = `${Common.PAYMENT_URL}/topup/stash`;

            axios({
                method:'POST',
                url,
                headers,
                data: body
              })
              .then(function (response) {   
                if (response.status === 201) {
                    // API returns CREATED on success
                  resolve(response.data);
                } else {
                  reject(response.data);
                }
              })
              .catch(function (error) {
                reject(error)
              });

        });
    }
    cardCheckoutCharge(params) {
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

                    checkoutToken: function (value) {
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

                    narration: function (value) {
                        if (!(/\S/).test(value)) {
                            return {
                                format: 'must not contain invalid narration - eg. Space'
                            };
                        }
                        return null;
                    },

                    metadata: function (value) {
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
                };

                if (error) {
                    makeErrorMessage(error);
                }
            };

            _validateParams();

            return new Promise(function (resolve, reject) {
                if (validationError) {
                    return reject(validationError);
                }

                const {
                    username, apiKey, format
                } = _self.options;
                const {
                    productName, checkoutToken, currencyCode, amount, narration, metadata
                } = options;

                const body = {
                    username,
                    productName,
                    checkoutToken,
                    currencyCode,
                    amount,
                    narration,
                    metadata,
                };

                const headers = {
                    apiKey: apiKey,
                    Accept: format,
                    'Content-Type': 'application/json'
                }

                const url = `${Common.PAYMENT_URL}/card/checkout/charge`;

                axios({
                    method:'POST',
                    url,
                    headers,
                    data: body
                  })
                  .then(function (response) {   
                    if (response.status === 201) {
                        // API returns CREATED on success
                      resolve(response.data);
                    } else {
                      reject(response.data);
                    }
                  })
                  .catch(function (error) {
                    reject(error)
                  });
                  
            });
        };

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

                    paymentCard: function (value) {
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

                    narration: function (value) {
                        if (!(/\S/).test(value)) {
                            return {
                                format: 'must not contain invalid narration - eg. Space'
                            };
                        }
                        return null;
                    },

                    metadata: function (value) {
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
                };

                if (error) {
                    makeErrorMessage(error);
                }
            };

            _validateParams();

            return new Promise(function (resolve, reject) {
                if (validationError) {
                    return reject(validationError);
                }

                const {
                    username, apiKey, format
                } = _self.options;
                const {
                    productName, paymentCard, currencyCode, amount, narration, metadata
                } = options;

                const body = {
                    username,
                    productName,
                    paymentCard,
                    currencyCode,
                    amount,
                    narration,
                    metadata,
                };

                const headers = {
                    apiKey: apiKey,
                    Accept: format,
                    'Content-Type': 'application/json'
                };

                const url = `${Common.PAYMENT_URL}/card/checkout/charge`;

                axios({
                    method:'POST',
                    url,
                    headers,
                    data: body
                  })
                  .then(function (response) {   
                    if (response.status === 201) {
                        // API returns CREATED on success
                      resolve(response.data);
                    } else {
                      reject(response.data);
                    }
                  })
                  .catch(function (error) {
                    reject(error)
                  });
            });
        };

        if (options.checkoutToken !== undefined) {
            return _cardCheckoutWithToken();
        }

        return _cardCheckoutWithPaymentCard();
    }
    cardCheckoutValidate(params) {
        const options = _.cloneDeep(params);
        const _self = this;
        let validationError;

        const _validateParams = function () {
            const paramsConstraints = {
                transactionId: function (value) {
                    if (!(/\S/).test(value)) {
                        return {
                            format: 'must not contain invalid transactionId - eg. Space'
                        };
                    }
                    return null;
                },

                otp: function (value) {
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
            };

            if (error) {
                makeErrorMessage(error);
            }
        };

        _validateParams();

        return new Promise(function (resolve, reject) {
            if (validationError) {
                return reject(validationError);
            }

            const {
                username, apiKey, format
            } = _self.options;
            const {
                transactionId, otp
            } = options;

            const body = {
                username,
                transactionId,
                otp,
            };

            const headers = {
                apiKey: apiKey,
                Accept: format,
                'Content-Type': 'application/json'
            };

            const url = `${Common.PAYMENT_URL}/card/checkout/validate`

            axios({
                method:'POST',
                url,
                headers,
                data: body
              })
              .then(function (response) {   
                if (response.status === 201) {
                    // API returns CREATED on success
                  resolve(response.data);
                } else {
                  reject(response.data);
                }
              })
              .catch(function (error) {
                reject(error)
              });
        });
    }
    fetchProductTransactions(params) {
        const options = _.cloneDeep(params);
        const _self = this;
        let validationError;

        const _validateParams = function () {
            const paramConstraints = {
                productName: {
                    presence: true,
                    isString: true
                },

                filters: function (filters) {
                    if (filters && !validate.isObject(filters)) {
                        return {
                            format: 'filters need to be a string map; i.e. {"filterKey":"filterValue"}'
                        };
                    }
                    return null;
                },

                "filters.pageNumber": {
                    presence: true,
                    isString: true
                },

                "filters.count": {
                    presence: true,
                    isString: true
                },

                "filters.startDate": {
                    presence: false,
                    isString: true
                },

                "filters.endDate": {
                    presence: false,
                    isString: true
                },

                "filters.category": {
                    presence: false,
                    isString: true
                },

                "filters.provider": {
                    presence: false,
                    isString: true
                },

                "filters.status": {
                    presence: false,
                    isString: true
                },

                "filters.source": {
                    presence: false,
                    isString: true
                },

                "filters.destination": {
                    presence: false,
                    isString: true
                },

                "filters.providerChannel": {
                    presence: false,
                    isString: true
                }
            };

            const error = validate(options, paramConstraints);

            const makeErrorMessage = function (error) {
                let msg = "";
                for (let k in error) {
                    msg += error[k] + "; ";
                }
                validationError = new Error(msg);
            };

            if (error) {
                makeErrorMessage(error);
            }
        };

        _validateParams();

        return new Promise(function (resolve, reject) {
            if (validationError) {
                return reject(validationError);
            }

            const {
                username, apiKey, format
            } = _self.options;

            const {
                productName, filters
            } = options;

            const {
                pageNumber, count, startDate, endDate, category, provider, status, source, destination, providerChannel
            } = filters;

            const body = {
                username,
                productName,
                pageNumber,
                count
            };

            if (startDate) {
                body.startDate = startDate;
            }

            if (endDate) {
                body.endDate = endDate;
            }

            if (category) {
                body.category = category;
            }

            if (provider) {
                body.provider = provider;
            }

            if (status) {
                body.status = status;
            }

            if (source) {
                body.source = source;
            }

            if (destination) {
                body.destination = destination;
            }

            if (providerChannel) {
                body.providerChannel = providerChannel;
            }

            const headers = {
                apiKey: apiKey,
                Accept: format,
                'Content-Type': 'application/json'
            };

            const url = `${Common.PAYMENT_URL}/query/transaction/fetch`;

            axios({
                method:'POST',
                url,
                headers,
                data: body
              })
              .then(function (response) {   
                if (response.status === 200) {
                    // API returns CREATED on success
                  resolve(response.data);
                } else {
                  reject(response.data);
                }
              })
              .catch(function (error) {
                reject(error)
              });
        });
    }
    findTransaction(params) {
        const options = _.cloneDeep(params);
        const _self = this;
        let validationError;

        const _validateParams = function () {
            const paramConstraints = {
                transactionId: {
                    presence: true,
                    isString: true
                }
            };

            const error = validate(options, paramConstraints);

            const makeErrorMessage = function (error) {
                let msg = "";
                for (let k in error) {
                    msg += error[k] + "; ";
                }
                validationError = new Error(msg);
            };

            if (error) {
                makeErrorMessage(error);
            }
        };

        _validateParams();

        return new Promise(function (resolve, reject) {
            if (validationError) {
                return reject(validationError);
            }

            const {
                username, apiKey, format
            } = _self.options;

            const { transactionId } = options;

            const body = {
                username,
                transactionId
            };

            const headers = {
                apiKey: apiKey,
                Accept: format,
                'Content-Type': 'application/json'
            };

            const url = `${Common.PAYMENT_URL}/query/transaction/find`

            axios({
                method:'POST',
                url,
                headers,
                data: body
              })
              .then(function (response) {   
                if (response.status === 200) {
                    // API returns CREATED on success
                  resolve(response.data);
                } else {
                  reject(response.data);
                }
              })
              .catch(function (error) {
                reject(error)
              });
        });
    }
    fetchWalletTransactions(params) {
        const options = _.cloneDeep(params);
        const _self = this;
        let validationError;

        const _validateParams = function () {
            const paramConstraints = {
                filters: function (filters) {
                    if (filters && !validate.isObject(filters)) {
                        return {
                            format: 'filters need to be a string map; i.e. {"filterKey":"filterValue"}'
                        };
                    }
                    return null;
                },

                "filters.pageNumber": {
                    presence: true,
                    isString: true
                },

                "filters.count": {
                    presence: true,
                    isString: true
                },

                "filters.startDate": {
                    presence: false,
                    isString: true
                },

                "filters.endDate": {
                    presence: false,
                    isString: true
                },

                "filters.categories": {
                    presence: false,
                    isString: true
                }
            };

            const error = validate(options, paramConstraints);

            const makeErrorMessage = function (error) {
                let msg = "";
                for (let k in error) {
                    msg += error[k] + "; ";
                }
                validationError = new Error(msg);
            };

            if (error) {
                makeErrorMessage(error);
            }
        };

        _validateParams();

        return new Promise(function (resolve, reject) {
            if (validationError) {
                return reject(validationError);
            }

            const {
                username, apiKey, format
            } = _self.options;

            const {
                pageNumber, count, startDate, endDate, categories
            } = options.filters;

            const body = {
                username,
                pageNumber,
                count
            };

            if (startDate) {
                body.startDate = startDate;
            }

            if (endDate) {
                body.endDate = endDate;
            }

            if (categories) {
                body.categories = categories;
            }

            const headers = {
                apiKey: apiKey,
                Accept: format,
                'Content-Type': 'application/json'
            };

            const url = `${Common.PAYMENT_URL}/query/wallet/fetch`;

            axios({
                method:'POST',
                url,
                headers,
                data: body
              })
              .then(function (response) {   
                if (response.status === 200) {
                    // API returns CREATED on success
                  resolve(response.data);
                } else {
                  reject(response.data);
                }
              })
              .catch(function (error) {
                reject(error)
              });
        });
    }
    fetchWalletBalance() {
        const _self = this;

        return new Promise(function (resolve, reject) {

            const {
                username, apiKey, format
            } = _self.options;

            const body = { username };

            const headers = {
                apiKey: apiKey,
                Accept: format,
                'Content-Type': 'application/json'
            };

            const url = `${Common.PAYMENT_URL}/query/wallet/balance`;

            axios({
                method:'POST',
                url,
                headers,
                data: body
              })
              .then(function (response) {   
                if (response.status === 200) {
                    // API returns CREATED on success
                  resolve(response.data);
                } else {
                  reject(response.data);
                }
              })
              .catch(function (error) {
                reject(error)
              });
        });
    }
}

/* For backward compatibility */
Payments.prototype.checkOut = Payments.prototype.mobileCheckout;
Payments.prototype.checkout = Payments.prototype.mobileCheckout;
Payments.prototype.payConsumer = Payments.prototype.mobileB2C;
Payments.prototype.payBusiness = Payments.prototype.mobileB2B;

module.exports = Payments;
