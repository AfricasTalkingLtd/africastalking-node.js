'use strict'

const should = require('should')
const _ = require('lodash')
const fixtures = require('./fixtures')

describe('Initialization', function () {
  this.timeout(5000)

  it('validates options', function () {
    const options = {
      apiKey: 5,
      username: 'salama',
      format: 'json' // or xml
    };

    (function () {
      require('../lib')(options)
    }).should.throw()

    delete options.apiKey;
    (function () {
      require('../lib')(options)
    }).should.throw()

    options.apiKey = 'SOME_POSSIBLE_VALID_KEY'
    const c = require('../lib')(options)
    should.exist(c)

    options.format = 'yaml';
    (function () {
      require('../lib')(options)
    }).should.throw()

    options.format = 'xml'
    delete options.username;
    (function () {
      require('../lib')(options)
    }).should.throw()
  })

  it('switches to and from sandbox', function () {
    delete require.cache[require.resolve('../lib')]
    delete require.cache[require.resolve('../lib/common.js')]

    const options = _.cloneDeep(fixtures.TEST_ACCOUNT)

    options.username = 'salama'
    let lib = require('../lib')(options)
    let common = require('../lib/common')

    common.BASE_URL.should.equal('https://api.africastalking.com/version1')
    common.VOICE_URL.should.equal('https://voice.africastalking.com')

    options.username = 'sandbox'
    lib = require('../lib')(options) // eslint-disable-line no-unused-vars
    common = require('../lib/common')

    common.BASE_URL.should.equal('https://api.sandbox.africastalking.com/version1')
    common.VOICE_URL.should.equal('https://voice.sandbox.africastalking.com')
  })
})
