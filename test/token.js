'use strict';

var should = require('should');
var validate = require('validate.js');
var fixtures = require('./fixtures.local');

describe('Token', function () {
    this.timeout(15000);

    it('creates checkout token', function (done) {

        var AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT);

        var p = AfricasTalking.TOKEN.createCheckoutToken("+254718769882");
        validate.isPromise(p).should.be.exactly(true);

        p.then(function (resp) {
            resp.should.have.property('token');
            done();

        }).catch(function (error) {
            done(new Error(error));
        });

    });

    it('generates auth token', function (done) {

        var AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT);

        var p = AfricasTalking.TOKEN.generateAuthToken();
        validate.isPromise(p).should.be.exactly(true);

        p.then(function (resp) {
            resp.should.have.property('token');
            resp.should.have.property('lifetimeInSeconds');
            done();

        }).catch(function (error) {
            done(new Error(error));
        });

    });
});
