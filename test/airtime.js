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
    
    it('validates options', function(){
        
        var options = {};
        
        (function() {
            let p = airtime.send(options);
        }).should.throw();
        
        options.recipients = [];
        (function() {
            let p = airtime.send(options);
        }).should.throw();
        
        options.recipients.push(
            {phoneNumber: 'not phone', amount:'NaN'}
            );
        (function() {
            let p = airtime.send(options);
        }).should.throw();
        
        
    });
    
    it('sends airtime', function(done){
       
       var opts = {
           recipients: [
               {
                   phoneNumber: '254726166685',
                   amount: 10
               },
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
   
    
});