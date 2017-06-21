'use strict';

var should = require('should');
var validate = require('validate.js');
var fixtures = require('./fixtures.local');

var AfricasTalking, payments;

describe('PAYMENTS', function(){

    this.timeout(5000);

    before(function () {
        AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT);
        payments = AfricasTalking.PAYMENTS;
    });


    describe("Checkout", function () {

        describe('validation', function () {
            var options = { };

            it('#checkout() cannot be empty', function () {
                return payments.checkout(options)
                    .should.be.rejected();
            });

            it('#checkout() must have username/productName/phoneNumber/currencyCode/amount params', function () {
                options.username = "+254718769882";
                options.from = null;
                options.message = null;

                return payments.checkout(options)
                    .should.be.rejected();
            });

            it('#checkout() may have string map metadata', function () {
                options.metadata = "Joe";
                return payments.checkout(options)
                    .should.be.rejected();
            });
        });


        it('checkout()', function () {
            let opts = {
                productName: "TestProduct",
                phoneNumber: "0718769882",
                currencyCode: "KES",
                metadata: {"Joe": "Biden", "id":"VP"},
                amount: 234.5
            };

            return payments.checkout(opts)
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

            it('#pay() cannot be empty', function () {
                return payments.pay(options)
                    .should.be.rejected();
            });

            it('#pay() must have productName/recipients', function () {
                options.productName = "Joe";

                return payments.pay(options)
                    .should.be.rejected();
            });

            it('#pay() recipients must be limited to 10', function () {
                options.productName = "Joe";
                options.recipients = [1,2,3,4,5,6,7,8,9,0,11];
                return payments.checkout(options)
                    .should.be.rejected();
            });
        });


        it('pay()', function () {
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

            return payments.pay(opts)
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

            it('#payb2b() cannot be empty', function () {
                return payments.payb2b(options)
                    .should.be.rejected();
            });

            it('#payb2b() may have string map metadata', function () {
                options.metadata = "Joe";
                return payments.payb2b(options)
                    .should.be.rejected();
            });

        });


        it('payb2b()', function () {
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

            return payments.payb2b(opts)
                .then(function(resp){
                    resp.should.have.property('status');
                })
                .catch(function(err){
                    throw (err);
                });
        });
    });


});
