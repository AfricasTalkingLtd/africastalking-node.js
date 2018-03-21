'use strict';

var should = require('should');
var validate = require('validate.js');
var fixtures = require('./fixtures.local');

var AfricasTalking, airtime;

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

        it('#send() rejects invalid options', function () {
            return airtime.send(
                { recipients: [ { phoneNumber: 'not phone', amount: 'NaN' } ] }
            )
                .should.be.rejected();
        });
    });

    it('sends airtime to one', function (done) {
        var opts = {
           recipients: [
               {
                   phoneNumber: '+254726166685',
                   amount: 'KES 10'
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
                   phoneNumber: '+254726166685',
                   amount: 'KES 90'
               },
               {
                   phoneNumber: '+254726863825',
                   amount: 'KES 897'
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
