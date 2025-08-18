'use strict'

const validate = require('validate.js')
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
    }).catch(done)
  })

  it('fetched account info', function (done) {
    const AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT)

    const p = AfricasTalking.ACCOUNT.fetchAccount()
    validate.isPromise(p).should.be.exactly(true)

    p.then(function (resp) {
      resp.should.have.property('UserData')
      done()
    }).catch(done)
  })
})
