'use strict';

var should = require('should');
var validate = require('validate.js');
var fixtures = require('./fixtures');

describe('Insights', function () {
    this.timeout(15000);

    it('check sim swap state', function (done) {

        var AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT);

        var p = AfricasTalking.INSIGHTS.checkSimSwapState(['+254710000000']);
        validate.isPromise(p).should.be.exactly(true);

        p.then(function (resp) {
            resp.should.have.property('status');
            resp.should.have.property('transactionId');
            done();

        }).catch(function (error) {
            done(new Error(error));
        });

    });
});
