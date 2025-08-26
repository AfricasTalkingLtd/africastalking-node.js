'use strict'

const joi = require('@hapi/joi')
const fixtures = require('./fixtures')

describe('Insights', function () {
  this.timeout(15000)

  it('check sim swap state', function (done) {
    const AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT)

    const p = AfricasTalking.INSIGHTS.checkSimSwapState(['+254710000000'])
    joi.assert(p, joi.object().instance(Promise))

    p.then(function (resp) {
      resp.should.have.property('status')
      resp.should.have.property('transactionId')
      done()
    })
      .catch(done)
  })
})
