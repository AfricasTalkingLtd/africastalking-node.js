'use strict'

require('should')
const joi = require('joi')
const nock = require('nock')
const fixtures = require('./fixtures')

let token

describe('Token', function () {
  before(function () {
    const AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT)
    token = AfricasTalking.TOKEN
  })

  it('generates auth token', function (done) {
    const p = token.generateAuthToken()
    joi.assert(p, joi.object().instance(Promise))

    p.then(function (resp) {
      resp.should.have.property('token')
      resp.should.have.property('lifetimeInSeconds')
      done()
    })
      .catch(done)
  })

  it('rejects when API returns token: None', function () {
    nock('https://api.sandbox.africastalking.com')
      .post('/auth-token/generate')
      .reply(200, { token: 'None', description: 'Invalid credentials' })

    return token.generateAuthToken().should.be.rejected()
  })

  it('rejects on network error', function () {
    nock('https://api.sandbox.africastalking.com')
      .post('/auth-token/generate')
      .replyWithError('Network failure')

    return token.generateAuthToken().should.be.rejected()
  })
})
