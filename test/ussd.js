'use strict';

var should = require('should');
var validate = require('validate.js');
var fixtures = require('./fixtures.local');
var express = require('express');

var AfricasTalking,
    USSD,
    request,
    app = express(),
    menu = 'Welcom to Nat Oil \n1: For account info \n2: For lost gas cylinder',
    accountInfo = "You are Jacky, registered on 4th-2016-March",
    invalidOption = "Invalid option";


var handler = function (params, next) {
    var endSession = false;
    var message = '';

    if (params.text === '') {
        message = menu;

    } else if (params.text === '1') {
        message = accountInfo;
        endSession = true;

    } else if (params.text === '2') {
        message = "Enter 1 for recovery \n";
        message += "Enter 2 for lost and found";
        endSession = true;

    } else {
        message = invalidOption;
        endSession = true;
    }

    next({response: message, endSession: endSession});
};

describe('USSD', function () {
    this.timeout(5000);

    before(function (done) {
        AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT);
        USSD = AfricasTalking.USSD;

        app.post('/test-service', new USSD(handler));
        request = require('supertest').agent(app.listen((err) => {
            if (err) throw err;
            done();
        }));

    });

    it('returns expected response', function (done) {
        request
            .post('/test-service')
            .send('hello')
            .expect('content-type', /text\/plain/i)
            .expect(200, function(err, resp) {
                var match = resp.text.match(/^(CON)|(END)/);
                should(match).be.ok();
                done()
            });
    });

    it('shows menu', function (done) {
        request
            .post('/test-service')
            .send({text: ''})
            .expect(200)
            .end(function (err, resp) {
                console.log(resp.text + "\n");
                var match = resp.text.match('CON ' + menu);
                should(match).be.ok();
                done();
            });
    });

    it('shows account info', function (done) {
        request
            .post('/test-service')
            .send({text: '1'})
            .expect(200)
            .end(function (err, resp) {
                console.log(resp.text + "\n");
                var match = resp.text.match('END ' + accountInfo);
                should(match).be.ok();
                done();
            });
    });

    it('shows in valid choice', function (done) {
        request
            .post('/test-service')
            .send({text: '13'})
            .expect(200)
            .end(function (err, resp) {
                console.log(resp.text + "\n");
                var match = resp.text.match('END ' + invalidOption);
                should(match).be.ok();
                done();
            });
    });
});
