'use strict';
const fixtures = require('./fixtures');

let AfricasTalking, airtime;

describe('Airtime', function(){

    this.timeout(15000);

    before(function () {
        AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT);
        airtime = AfricasTalking.AIRTIME;
    });

    describe('validation', function () {
        it('#send() cannot be empty', function () {
            return airtime.send({})
                .should.be.rejected();
        });

        it('#send() must have phoneNumber/currencyCode/amount', function () {
            return airtime.send(
                { recipients: [ { phoneNumber: fixtures.phoneNumber } ] }
            )
                .should.be.rejected();
        });
        
        it('#send() rejects because there is at least one invalid phoneNumber', function(){
            const opts = {
                recipients: [
                    {
                        phoneNumber: '+25571234567890',
                        currencyCode: 'KES',
                        amount: 5
                    },
                    {
                        phoneNumber: '',
                        currencyCode: 'KES',
                        amount: 5
                    },
                    {
                        phoneNumber: '+25712345678',
                        currencyCode: 'KES',
                        amount: 5
                    },
                ]
            };
            
            return airtime.send(opts).should.be.rejected();
    
        });

        it('#send() rejects invalid options', function () {
            return airtime.send(
                { recipients: [ { phoneNumber: 'not phone', currencyCode: '', amount: 'NaN' } ] }
            )
                .should.be.rejected();
        });
    });

    it('sends airtime to one', function (done) {
        var opts = {
            recipients: [
                {
                    phoneNumber: fixtures.phoneNumber,
                    currencyCode: 'KES',
                    amount: 10
                }
            ],
        };

        airtime.send(opts)
            .then(function(resp){
                resp.should.have.property('responses');
                done();
            })
            .catch(function(){
                done();
            });

    });

    it('should find airtime transaction status', function (done) {
        const opts = {
            transactionId: 'ATPid_9b4xxxxxxxccb27b13225',
        };

        airtime.findTransactionStatus(opts)
            .then(function(resp){
                resp.should.have.property('status');
                done();
            })
            .catch(function(){
                done();
            });

    });

    it('sends airtime to many', function(done){

        var opts = {
            recipients: [
                {
                    phoneNumber: fixtures.phoneNumber,
                    currencyCode: 'KES',
                    amount: 90
                },
                {
                    phoneNumber: fixtures.phoneNumber,
                    currencyCode: 'KES',
                    amount: 897
                }
            ],
            maxNumRetry: 1
        };
        
        airtime.send(opts)
            .then(function(resp){
                resp.should.have.property('responses');
                done();
            })
            .catch(function(){
                done();
            });
        });
});
