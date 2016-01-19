'use strict';

var should = require('should');
var validate = require('validate.js');
var fixtures = require('./fixtures');

var AfricasTalking, sms;

describe('SMS', function () {
    this.timeout(5000);

    before(function () {
        AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT);
        sms = AfricasTalking.SMS;
    });

    it('validates options', function () {

        var options = { };

        (function() {
            let p = sms.send(options);
        }).should.throw();

        options.to = "+254718769882";
        options.from = null;
        options.message = null;
        (function() {
            let p = sms.send(options);
        }).should.throw();


        options.enqueue = "Joe";
        (function() {
            let p = sms.sendBulk(options);
        }).should.throw();


        (function() {
            let p = sms.sendPremium(options);
        }).should.throw();

        let p = sms.fetchMessages(options);
        validate.isPromise(p).should.be.exactly(true);

        (function() {
            let p = sms.createSubscription(options);
        }).should.throw();

        (function() {
            let p = sms.fetchSubscription(options);
        }).should.throw();

    });


    it('fetches messages', function (done) {

        sms.fetchMessages()
            .then(function (messages) {
                messages.should.have.property('SMSMessageData');
                done();
            })
            .catch(function (error) {
                console.error(error);
                done();
            });

    });

    it('sends single simple message', function (done) {

        var opts = {
            to: "254718769882",
            message: "This is a test"
        };
        sms.send(opts)
            .then(function (resp) {
                resp.should.have.property('SMSMessageData');
                done();
            })
            .catch(function (err) {
                console.error(err);
                done();
            });

    });

    it('sends multiple simple message', function (done) {
        var opts = {
            to: ["254718769882", "254718769882"],
            message: "This is mulitple recipients test"
        };
        sms.send(opts)
            .then(function (resp) {
                resp.should.have.property('SMSMessageData');
                done();
            })
            .catch(function (err) {
                console.error(err);
                done();
            });

    });

    it('sends bulk message', function (done) {
        var opts = {
            to: ["254718769882"],
            message: "This is bulk test",
            enqueue: true
        };
        sms.sendBulk(opts)
            .then(function (resp) {
                resp.should.have.property('SMSMessageData');
                done();
            })
            .catch(function (err) {
                console.error(err);
                done();
            });

    });

    it('sends premium message', function (done) {

        var opts = {
            to: "254718760882",
            from: "testService",
            message: "This is premium test",
            keyword: "test",
            linkId: "76test",
            retryDurationInHours: 1
        };
        sms.sendPremium(opts)
            .then(function (resp) {
                resp.should.have.property('SMSMessageData');
                done();
            })
            .catch(function (err) {
                console.error(err);
                done();
            });

    });

});