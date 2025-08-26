'use strict'

const joi = require('@hapi/joi')
const fixtures = require('./fixtures')

describe('Application', function () {
  this.timeout(15000)

  it('fetched application data', function (done) {
    const AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT)

    const p = AfricasTalking.APPLICATION.fetchApplicationData()
    joi.assert(p, joi.object().instance(Promise))

    p.then(function (resp) {
      resp.should.have.property('UserData')
      done()
    }).catch(done)
  })

  it('fetched account info', function (done) {
    const AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT)

    const p = AfricasTalking.ACCOUNT.fetchAccount()
    joi.assert(p, joi.object().instance(Promise))

    p.then(function (resp) {
      resp.should.have.property('UserData')
      done()
    }).catch(done)
  })
})
