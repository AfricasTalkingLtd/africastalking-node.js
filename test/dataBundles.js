'use strict';

const should = require('should');
const validate = require('validate.js');
const fixtures = require('./fixtures');

let AfricasTalking, dataBundles;

describe('Mobile Data Bundles', function(){

    this.timeout(15000);

    before(function () {
        AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT);
        dataBundles = AfricasTalking.DATABUNDLES;
    });

    describe('validation', function () {
        it('#send() cannot be empty', function () {
            return dataBundles.send({})
                .should.be.rejected();
        });

        it('#send() must have phoneNumber, quantity, unit and validity', function () {
            const opts =  {
                username:'test',
                productName:'Mobile Data',
                recipients: [ { phoneNumber: fixtures.phoneNumber } ]
            }

            return dataBundles.send(opts).should.be.rejected();
        });
        
        it('#send() rejects because there is at least one invalid phoneNumber', function(){
            const opts = {
                username:'test',
                productName:'Mobile Data',
                recipients: [
                    {
                        phoneNumber: '+25571234567890223',
                        quantity: 50,
                        unit: 'MB',
                        validity: 'Day',
                        isPromoBundle: false,
                        metadata: {
                            "first_name": "Daggie",
                            "last_name": "Blanqx"
                        }
                    },
                ]
            };
            
            return dataBundles.send(opts).should.be.rejected();
    
        });

        it('#send() rejects invalid options', function () {
            const opts = {
                username:'test',
                productName:'Mobile Data',
                recipients: [
                    {
                        phoneNumber: 'not phone',
                        quantity: 50,
                        unit: 'ZB',
                        validity: 'Today'
                    },
                ]
            };

            return dataBundles.send(opts).should.be.rejected();
        });
    });

    it('sends databundles to one', function (done) {
        const opts = {
            username:'test',
            productName:'Mobile Data',
            recipients: [
                {
                    phoneNumber: fixtures.phoneNumber,
                    quantity: 50,
                    unit: 'MB',
                    validity: 'Day'
                },
            ]
        };

        dataBundles.send(opts)
            .then(function(resp){
                resp.should.have.property('responses');
                done();
            })
            .catch(function(err){
                console.error(err);
                done();
            });

    });

    it('sends databundles to many', function(done){
        const opts = {
            username:'test',
            productName:'Mobile Data',
            recipients: [
                {
                    phoneNumber: fixtures.phoneNumber,
                    quantity: 50,
                    unit: 'MB',
                    validity: 'Day'
                },
                {
                    phoneNumber: fixtures.phoneNumber,
                    quantity: 50,
                    unit: 'MB',
                    validity: 'Day'
                },
            ]
        };
        
        dataBundles.send(opts)
            .then(function(resp){
                resp.should.have.property('responses');
                done();
            })
            .catch(function(err){
                console.error(err);
                done();
            });
        });
});
