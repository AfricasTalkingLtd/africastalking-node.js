'use strict';

var should = require('should');
var validate = require('validate.js');
var fixtures = require('./fixtures');

describe('Token', function () {
    this.timeout(15000);

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
