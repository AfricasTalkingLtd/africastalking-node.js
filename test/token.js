'use strict'

const joi = require('joi')
const fixtures = require('./fixtures')

describe('Token', function () {
  before(() => {
    fixtures.mockToken()
  })

  it('generates auth token', function (done) {
    const AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT)

    const p = AfricasTalking.TOKEN.generateAuthToken()
    joi.assert(p, joi.object().instance(Promise))

    p.then(function (resp) {
      resp.should.have.property('token')
      resp.should.have.property('lifetimeInSeconds')
      done()
    })
      .catch(done)
  })
})
