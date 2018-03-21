'use strict';

var should = require('should');
var validate = require('validate.js');
var fixtures = require('./fixtures.local');

describe('Application', function () {
    this.timeout(15000);

    it('fetched application data', function (done) {

        var AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT);

        var p = AfricasTalking.APPLICATION.fetchApplicationData();
        validate.isPromise(p).should.be.exactly(true);

        p.then(function (resp) {
            resp.should.have.property('UserData');
            done();

        }).catch(function (error) {
            console.log(error);
            done();
        });

    });

    it('fetched account info', function (done) {

        var AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT);

        var p = AfricasTalking.ACCOUNT.fetchAccount();
        validate.isPromise(p).should.be.exactly(true);

        p.then(function (resp) {
            resp.should.have.property('UserData');
            done();

        }).catch(function (error) {
            console.log(error);
            done();
        });

    });
});
