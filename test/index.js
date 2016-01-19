'use strict';

var should = require('should');
var validate = require('validate.js');
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

});
