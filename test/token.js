'use strict'

require('should')
const joi = require('joi')
const fixtures = require('./fixtures')

let token

describe('Token', function () {
  before(function () {
    fixtures.mockServices()
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
    return token.generateAuthToken().should.be.rejected()
  })

  it('rejects on network error', function () {
    return token.generateAuthToken().should.be.rejected()
  })
})
