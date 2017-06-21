'use strict';

var should = require('should');
var fixtures = require('./fixtures.local');

var AfricasTalking, sms;

describe('SMS', function () {
    this.timeout(5000);

    before(function () {
        AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT);
        sms = AfricasTalking.SMS;
    });

    describe('validation', function () {
        var options = { };

        it('#send() cannot be empty', function () {
            return sms.send(options)
                .should.be.rejected();
        });

        it('#send() must have to/from/message params', function () {
            options.to = "+254718769882";
            options.from = null;
            options.message = null;

            return sms.send(options)
                .should.be.rejected();
        });

        it('#sendBulk()', function () {
            options.enqueue = "Joe";
            return sms.sendBulk(options)
                .should.be.rejected();
        });

        it('#sendPremium()', function () {
            return sms.sendPremium(options)
                .should.be.rejected();
        });

        it('#createSubscription()', function () {
            return sms.createSubscription(options)
                .should.be.rejected();
        });

        it('#fetchSubscription()', function () {
            return sms.fetchSubscription(options)
                .should.be.rejected();
        });
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
