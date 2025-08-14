'use strict'

const joi = require('@hapi/joi')
const fixtures = require('./fixtures')

describe('Token', function () {
  this.timeout(15000)

  it('generates auth token', function (done) {
    const AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT)

    const p = AfricasTalking.TOKEN.generateAuthToken()
    joi.assert(p, joi.object().instance(Promise))

    p.then(function (resp) {
      resp.should.have.property('token')
      resp.should.have.property('lifetimeInSeconds')
      done()
    }).catch(function (error) {
      done(new Error(error))
    })
  })
})
