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



});
