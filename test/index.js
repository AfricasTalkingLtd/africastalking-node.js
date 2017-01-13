'use strict';

var should = require('should');
var validate = require('validate.js');
var _ = require('lodash');
var fixtures = require('./fixtures');

describe('Initialization', function () {
    this.timeout(5000);

    it('validates options', function () {

        var options = {
            apiKey: 5,
            username: 'salama',
            format: 'json' // or xml
        };

        (function (){
            require('../lib')(options);
        }).should.throw();

        delete options.apiKey;
        (function (){
            require('../lib')(options);
        }).should.throw();

        options.apiKey = 'SOME_POSSIBLE_VALID_KEY';
        var c = require('../lib')(options);
        should.exist(c);

        options.format = "yaml";
        (function (){
            require('../lib')(options);
        }).should.throw();

        options.format = "xml";
        delete options.username;
        (function (){
            require('../lib')(options);
        }).should.throw();

    });

    it('switches to and from sandbox', function () {
        var options = _.cloneDeep(fixtures.TEST_ACCOUNT);

        options.debug = false;
        var lib = require('../lib')(options);
        var common = require('../lib/common');

        common.BASE_URL.should.equal("https://api.africastalking.com/version1");
        common.VOICE_URL.should.equal("https://voice.africastalking.com");

        options.debug = true;
        lib = require('../lib')(options);
        common = require('../lib/common');

        common.BASE_URL.should.equal("https://api.sandbox.africastalking.com/version1");
        common.VOICE_URL.should.equal("https://voice.sandbox.africastalking.com");

    });

});
