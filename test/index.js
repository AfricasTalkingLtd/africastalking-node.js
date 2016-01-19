'use strict';

var should = require('should');
var validate = require("validate.js");
var fixtures = require('./fixtures');

describe('Initialization', function () {
    this.timeout(5000);

    it('validates options', function () {

        var options = {
            apiKey: 5,
            username: 'salama',
            format: 'json' // or xml
        };
        var a = require('../lib')(options);
        should.not.exist(a);

        delete options.apiKey;
        var b = require('../lib')(options);
        should.not.exist(b);

        options.apiKey = 'SOME_POSSIBLE_VALID_KEY';
        var c = require('../lib')(options);
        should.exist(c);

        options.format = "yaml";
        var d = require('../lib')(options);
        should.not.exist(d);

        options.format = "xml";
        delete options.username;
        var e = require('../lib')(options);
        should.not.exist(e);

    });

});

describe('Account', function () {
    this.timeout(5000);

    it('fetched account info', function (done) {

        var AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT);

        var p = AfricasTalking.fetchAccount();
        validate.isPromise(p).should.be.exactly(true);

        p.then(function (resp) {
            resp.should.have.property('UserData');
            done();

        }).catch(function (error) {
            should.not.exist(error);
            done();
        });

    });
});
