'use strict';

var should = require('should');
var validate = require('validate.js');
var fixtures = require('./fixtures.local');

var AfricasTalking, payments;

describe('Payment', function(){

    this.timeout(15000);

    before(function () {
        AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT);
        payments = AfricasTalking.PAYMENTS;
    });


    describe("mobileCheckout", function () {

        describe('validation', function () {
            var options = { };

            it('#mobileCheckout() cannot be empty', function () {
                return payments.mobileCheckout(options)
                    .should.be.rejected();
            });

            it('#mobileCheckout() must have username/productName/phoneNumber/currencyCode/amount params', function () {
                options.username = "+254718769882";
                options.from = null;
                options.message = null;

                return payments.mobileCheckout(options)
                    .should.be.rejected();
            });

            it('#mobileCheckout() may have string map metadata', function () {
                options.metadata = "Joe";
                return payments.mobileCheckout(options)
                    .should.be.rejected();
            });
        });

        it('mobileCheckout()', function () {
            let opts = {
                productName: "TestProduct",
                phoneNumber: "+254718769882",
                currencyCode: "KES",
                metadata: {"Joe": "Biden", "id":"VP"},
                amount: 234.5
            };

            return payments.mobileCheckout(opts)
                .then(function(resp){
                    resp.should.have.property('status');
                })
                .catch(function(err){
                    throw (err);
                });
        });
    });

    describe("B2C", function () {

        describe('validation', function () {
            var options = { };

            it('#mobileB2C() cannot be empty', function () {
                return payments.mobileB2C(options)
                    .should.be.rejected();
            });

            it('#mobileB2C() must have productName/recipients', function () {
                options.productName = "Joe";

                return payments.mobileB2C(options)
                    .should.be.rejected();
            });

            it('#mobileB2C() recipients must be limited to 10', function () {
                options.productName = "Joe";
                options.recipients = [1,2,3,4,5,6,7,8,9,0,11];
                return payments.mobileB2C(options)
                    .should.be.rejected();
            });
        });


        it('mobileB2C()', function () {
            let opts = {
                productName: "TestProduct",
                recipients: [
                    {
                        phoneNumber: "254718769882",
                        currencyCode: "KES",
                        reason: payments.REASON.SALARY,
                        metadata: {"Joe": "Biden", "id":"VP"},
                        amount: 234.5
                    }
                ]
            };

            return payments.mobileB2C(opts)
                .then(function(resp){
                    resp.should.have.property('numQueued');
                    resp.should.have.property('entries');
                })
                .catch(function(err){
                    throw (err);
                });
        });
    });

    describe("B2B", function () {

        describe('validation', function () {
            var options = { };

            it('#mobileB2B() cannot be empty', function () {
                return payments.mobileB2B(options)
                    .should.be.rejected();
            });

            it('#mobileB2B() may have string map metadata', function () {
                options.metadata = "Joe";
                return payments.mobileB2B(options)
                    .should.be.rejected();
            });

        });


        it('mobileB2B()', function () {
            const opts = {
                productName: "TestProduct",
                provider: payments.PROVIDER.ATHENA,
                transferType: payments.TRANSFER_TYPE.B2B_TRANSFER,
                currencyCode: "KES",
                amount: 100,
                destinationChannel: '456789',
                destinationAccount: 'octopus',
                metadata: {"notes": "Account top-up for July 2017"},
            };

            return payments.mobileB2B(opts)
                .then(function(resp){
                    resp.should.have.property('status');
                })
                .catch(function(err){
                    throw (err);
                });
        });
    });

    describe('Wallet', function() {
        describe('validation', function () {
            let options = {};

            it('#walletTransfer() cannot be empty', function () {
                return payments.walletTransfer(options)
                    .should.be.rejected();
            });

            it('#walletTransfer() must have productName/targetProductCode/currencyCode/amount/metadata', function () {
                options.productName = "Joe";
                return payments.walletTransfer(options)
                    .should.be.rejected();
            });

            it('#topupStash() cannot be empty', function () {
                return payments.topupStash(options)
                    .should.be.rejected();
            });

            it('#topupStash() must have productName/currencyCode/amount/metadata', function () {
                options.productName = "Joe";
                return payments.topupStash(options)
                    .should.be.rejected();
            });
        });

        it('walletTransfer()', function () {

            let opts = {
                productName: "TestProduct",
                targetProductCode: 3323,
                currencyCode: "NGN",
                amount: 50,
                metadata: {
                    "Joe": "Biden",
                    "id": "VP",
                },
            };

            return payments.walletTransfer(opts)
                .then(function(resp) {
                    resp.should.have.property('status');
                })
                .catch(function(err) {
                    throw err;
                });
        });

        it('topupStash()', function () {

            let opts = {
                productName: "TestProduct",
                currencyCode: "NGN",
                amount: 50,
                metadata: {
                    "Joe": "Biden",
                    "id": "VP",
                },
            };

            return payments.topupStash(opts)
                .then(function(resp) {
                    resp.should.have.property('status');
                })
                .catch(function(err) {
                    throw err;
                });
        });

    });

    describe('Bank', function () {

        describe('validation', function () {
            let options = {};

            it('#bankCheckout() cannot be empty', function () {
                return payments.bankCheckout(options)
                    .should.be.rejected();
            });

            it('#bankCheckout() must have productName/bankAccount/currencyCode/amount/narration', function () {
                options.productName = "Joe";

                return payments.bankCheckout(options)
                    .should.be.rejected();
            });

            it('#bankCheckout() may have string map metadata', function () {
                options.metadata = "Joe";
                return payments.bankCheckout(options)
                    .should.be.rejected();
            });

            it('#validateBankCheckout() cannot be empty', function () {
                options = {};

                return payments.validateBankCheckout(options)
                    .should.be.rejected();
            });

            it('#validateBankCheckout() must have transactionId/otp', function () {
                options.otp = "1234";

                return payments.validateBankCheckout(options)
                    .should.be.rejected();
            });

            it('#bankTransfer() cannot be empty', function () {
                options = {};

                return payments.bankTransfer(options)
                    .should.be.rejected();
            });

            it('#bankTransfer() must have productName/recipients', function () {
                options.productName = "TestProduct";

                return payments.bankTransfer(options)
                    .should.be.rejected();
            });
        });

        it('bankCheckout()', function () {
            let opts = {
                productName: "TestProduct",
                bankAccount: {
                    accountName: "Test Bank Account",
                    accountNumber: "1234567890",
                    bankCode: payments.BANK.FCMB_NG,
                },
                currencyCode: "NGN",
                amount: 50,
                narration: "Test Payment",
                metadata: {
                    "Joe": "Biden",
                    "id": "VP",
                },
            };

            return payments.bankCheckout(opts)
                .then(function(resp) {
                    resp.should.have.property('status');
                })
                .catch(function(err) {
                    throw err;
                });
        });

        it('validateBankCheckout()', function () {
            let opts = {
                transactionId: "ATPid_SampleTxnId1",
                otp: "1234",
            };

            return payments.validateBankCheckout(opts)
                .then(function(resp) {
                    resp.should.have.property('status');
                })
                .catch(function(err) {
                    throw err;
                });
        });

        it('bankTransfer()', function () {
            let opts = {
                productName: "TestProduct",
                recipients: [{
                    bankAccount: {
                        accountName: "Test Bank Account",
                        accountNumber: "1234567890",
                        bankCode: payments.BANK.FCMB_NG,
                    },
                    currencyCode: "NGN",
                    amount: 50,
                    narration: "Test Payment",
                    metadata: {
                        "Joe": "Biden",
                        "id": "VP"
                    },
                }],
            };

            return payments.bankTransfer(opts)
                .then(function(resp) {
                    resp.should.have.property('entries');
                })
                .catch(function(err) {
                    throw err;
                });
        });
    });

    describe('Card', function () {
        describe('validation', function() {
            let options = {};
            
            it('#cardCheckout() cannot be empty', function () {
                return payments.cardCheckout(options)
                    .should.be.rejected();
            });

            it('#cardCheckout() must have productName/paymentCard/currencyCode/amount/narration', function () {
                options.productName = "Joe";

                return payments.cardCheckout(options)
                    .should.be.rejected();
            });

            it('#cardCheckout() may not have string map metadata', function () {
                options.metadata = "Joe";
                return payments.cardCheckout(options)
                    .should.be.rejected();
            });

            it('#validateCardCheckout() cannot be empty', function () {
                options = {};

                return payments.validateCardCheckout(options)
                    .should.be.rejected();
            });

            it('#validateCardCheckout() must have transactionId/otp', function () {
                options.otp = "1234";

                return payments.validateCardCheckout(options)
                    .should.be.rejected();
            });
        });

        it('cardCheckoutWithPaymentCard()', function () {
            let opts = {
                productName: "TestProduct",
                paymentCard: {
                    number: "123456789000",
                    cvvNumber: 654,
                    expiryMonth: 7,
                    expiryYear: 2019,
                    authToken: "2345",
                    countryCode: "234",
                },
                currencyCode: "NGN",
                amount: 50,
                narration: "Test Payment",
                metadata: {
                    "Joe": "Biden",
                    "id": "VP",
                },
            };

            return payments.cardCheckout(opts)
                .then(function(resp) {
                    resp.should.have.property('status');
                })
                .catch(function(err) {
                    throw err;
                });
        });

        it('cardCheckoutWithToken()', function () {
            let opts = {
                productName: "TestProduct",
                checkoutToken: "12abvsfdhh63535",
                currencyCode: "NGN",
                amount: 50,
                narration: "Test Payment",
                metadata: {
                    "Joe": "Biden",
                    "id": "VP",
                },
            };

            return payments.cardCheckout(opts)
                .then(function(resp) {
                    resp.should.have.property('status');
                })
                .catch(function(err) {
                    throw err;
                });
        });

        it('validateCardCheckout()', function () {
            let opts = {
                transactionId: "ATPid_SampleTxnId1",
                otp: "1234"
            };

            return payments.validateCardCheckout(opts)
                .then(function(resp) {
                    resp.should.have.property('status');
                })
                .catch(function(err) {
                    throw err;
                });
        });
    });
});
