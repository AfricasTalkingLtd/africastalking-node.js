'use strict'

const joi = require('@hapi/joi')
const fixtures = require('./fixtures')

describe('Application', function () {
  this.timeout(15000)

  it('fetched application data', function (done) {
    const AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT)

    const p = AfricasTalking.APPLICATION.fetchApplicationData()
    validate.isPromise(p).should.be.exactly(true)

    p.then(function (resp) {
      resp.should.have.property('UserData')
      done()
    }).catch(function (error) {
      console.log(error)
      done()
    })
  })

  it('fetched account info', function (done) {
    const AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT)

    const p = AfricasTalking.ACCOUNT.fetchAccount()
    joi.assert(p, joi.object().instance(Promise));

    p.then(function (resp) {
      resp.should.have.property('UserData')
      done()
    }).catch(function (error) {
      console.log(error)
      done()
    })
  })
})
