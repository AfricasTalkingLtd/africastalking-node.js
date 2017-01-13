'use strict';

var should = require('should');
var validate = require('validate.js');
var fixtures = require('./fixtures');

var AfricasTalking, airtime;

describe('AIRTIME', function(){

    this.timeout(5000);

    before(function () {
        AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT);
        airtime = AfricasTalking.AIRTIME;
    });

    describe('validation', function () {
        var options = {};

        it('#send() cannot be empty', function () {
            return airtime.send(options)
                .should.be.rejected();
        });

        options.recipients = [];

        it('#send() rejects have empty recipients', function () {
            return airtime.send(options)
                .should.be.rejected();
        });

        options.recipients.push(
            { phoneNumber: 'not phone', amount: 'NaN' }
        );

        it('#send() rejects invalid options', function () {
            return airtime.send(options)
                .should.be.rejected();
        });

        options.recipients = [
            { phoneNumber: '0712345678', amount: 9 }
        ];

        it('#send() amount must be greater than 10', function () {
            return airtime.send(options)
                .should.be.rejected();
        });

        options.recipients = [
            {phoneNumber: '0712345678', amount:10001}
        ];

        it('#send() amount must be less than 10000', function () {
            return airtime.send(options)
                .should.be.rejected();
        });
    });

    it('sends airtime to one', function (done) {
        var opts = {
           recipients: [
               {
                   phoneNumber: '254726166685',
                   amount: 10
               }
           ]
        };

        airtime.send(opts)
            .then(function(resp){
                resp.should.have.property('responses');
                done();
            })
            .catch(function(err){
                console.error(err);
                done();
            });

    });

    it('sends airtime to many', function(done){

       var opts = {
           recipients: [
               {
                   phoneNumber: '254726166685',
                   amount: 10
               },
               {
                   phoneNumber: '0726863825',
                   amount: 10
               }
           ]
       };

       airtime.send(opts)
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
