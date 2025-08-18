'use strict'

const fixtures = require('./fixtures')

let AfricasTalking, mobileData

describe('Mobile Data Bundles', function () {
  this.timeout(15000)

  before(function () {
    AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT)
    mobileData = AfricasTalking.MOBILE_DATA
  })

  describe('validation', function () {
    it('#send() cannot be empty', function () {
      return mobileData.send({})
        .should.be.rejected()
    })

    it('#send() must have phoneNumber, quantity, unit and validity', function () {
      const opts = {
        productName: 'Mobile Data',
        recipients: [{ phoneNumber: fixtures.phoneNumber }]
      }

      return mobileData.send(opts).should.be.rejected()
    })

    it('#send() rejects because there is at least one invalid phoneNumber', function () {
      const opts = {
        productName: 'Mobile Data',
        recipients: [
          {
            phoneNumber: '+25571234567890223',
            quantity: 50,
            unit: 'MB',
            validity: 'Day',
            metadata: {
              first_name: 'Daggie',
              last_name: 'Blanqx'
            }
          }
        ]
      }

      return mobileData.send(opts).should.be.rejected()
    })

    it('#send() rejects invalid options', function () {
      const opts = {
        productName: 'Mobile Data',
        recipients: [
          {
            phoneNumber: 'not phone',
            quantity: 50,
            unit: 'ZB',
            validity: 'Today'
          }
        ]
      }

      return mobileData.send(opts).should.be.rejected()
    })
  })

  it('sends mobiledata to one', function (done) {
    const opts = {
      productName: 'TestProduct',
      recipients: [
        {
          phoneNumber: fixtures.phoneNumber,
          quantity: 50,
          unit: 'MB',
          validity: 'Day',
          metadata: {
            happy: 'yes',
            name: 'John Doe'
          }
        }
      ]
    }

    mobileData.send(opts)
      .then(function (resp) {
        resp.should.have.property('entries')
        done()
      })
      .catch(done)
  })

  it('sends mobiledata to many', function (done) {
    const opts = {
      productName: 'TestProduct',
      recipients: [
        {
          phoneNumber: fixtures.phoneNumber,
          quantity: 50,
          unit: 'MB',
          validity: 'Day',
          metadata: {
            happy: 'yes',
            name: 'John Doe'
          }
        },
        {
          phoneNumber: fixtures.phoneNumber,
          quantity: 50,
          unit: 'MB',
          validity: 'Day',
          metadata: {
            happy: 'yes',
            name: 'John Doe'
          }
        }
      ]
    }

    mobileData.send(opts)
      .then(function (resp) {
        resp.should.have.property('entries')
        done()
      })
      .catch(done)
  })

  it('checks for transaction status', function (done) {
    const opts = {
      transactionId: 'ATPid_9b4xxxxxxxccb27b13800'
    }

    mobileData.findTransaction(opts)
      .then(function (resp) {
        resp.should.have.property('status')
        done()
      })
      .catch(done)
  })

  it('checks for balance left', function (done) {
    mobileData.fetchWalletBalance()
      .then(function (resp) {
        resp.should.have.property('status')
        done()
      })
      .catch(done)
  })
})
