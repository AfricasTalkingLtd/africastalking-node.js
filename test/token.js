'use strict'

const validate = require('validate.js')
const fixtures = require('./fixtures')

describe('Token', function () {
  this.timeout(15000)

  it('generates auth token', function (done) {
    const AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT)

    const p = AfricasTalking.TOKEN.generateAuthToken()
    validate.isPromise(p).should.be.exactly(true)

    p.then(function (resp) {
      resp.should.have.property('token')
      resp.should.have.property('lifetimeInSeconds')
      done()
    }).catch(function (error) {
      done(new Error(error))
    })
  })
})
