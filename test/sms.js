'use strict'

const fixtures = require('./fixtures')

let AfricasTalking, sms

describe('SMS', function () {
  this.timeout(5000)

  before(function () {
    AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT)
    sms = AfricasTalking.SMS
  })

  describe('validation', function () {
    const options = {}

    it('Rejects invalid phone numbers', function () {
      const phoneNumbers = [
        '+254713',
        '+2547XXXXXXXX',
        '0712345678',
        '+25571234567890',
        ''
      ]

      const options = {
        to: phoneNumbers,
        message: 'Hi! #WeLoveNerds',
        enqueue: true
      }

      return sms.send(options).should.be.rejected()
    })

    it('#send() cannot be empty', function () {
      return sms.send(options).should.be.rejected()
    })

    it('#send() must have to/senderId/message params', function () {
      options.to = fixtures.phoneNumber
      options.senderId = null
      options.message = null

      return sms.send(options).should.be.rejected()
    })

    it('#sendBulk()', function () {
      options.enqueue = 'Joe'
      return sms.sendBulk(options).should.be.rejected()
    })

    it('#sendPremium()', function () {
      return sms.sendPremium(options).should.be.rejected()
    })

    it('#createSubscription()', function () {
      return sms.createSubscription(options).should.be.rejected()
    })

    it('#fetchSubscription()', function () {
      return sms.fetchSubscription(options).should.be.rejected()
    })

    it('#deleteSubscription()', function () {
      return sms.deleteSubscription(options).should.be.rejected()
    })
  })

  it('fetches messages', function (done) {
    sms
      .fetchMessages()
      .then(function (messages) {
        messages.should.have.property('SMSMessageData')
        done()
      })
      .catch(done)
  })

  it('fetches subscription', function (done) {
    const opts = {
      shortCode: '46585',
      keyword: 'TESTKWD'
    }

    sms
      .fetchSubscription(opts)
      .then(function (subscriptions) {
        subscriptions.should.have.property('responses')
        done()
      })
      .catch(done)
  })

  it('creates subscription', function (done) {
    const opts = {
      shortCode: '46585',
      keyword: 'TESTKWD',
      phoneNumber: fixtures.phoneNumber
    }

    sms
      .createSubscription(opts)
      .then(function (resp) {
        resp.should.have.property('status')
        done()
      })
      .catch(done)
  })

  it('rejects creates subscription when shortCode is missing', function () {
    const opts = {
      keyword: 'TESTKWD',
      phoneNumber: fixtures.phoneNumber
    }
    return sms.createSubscription(opts).should.be.rejected()
  })

  it('rejects create subscription when phoneNumber is missing', function () {
    const opts = {
      shortCode: '46585',
      keyword: 'TESTKWD'
    }
    return sms.createSubscription(opts).should.be.rejected()
  })

  it('deletes subscription', function (done) {
    const opts = {
      shortCode: '46585',
      keyword: 'TESTKWD',
      phoneNumber: fixtures.phoneNumber
    }

    sms
      .deleteSubscription(opts)
      .then(function (resp) {
        resp.should.have.property('status')
        done()
      })
      .catch(done)
  })

  it('sends single simple message', function (done) {
    const opts = {
      to: fixtures.phoneNumber,
      message: 'This is a test',
      enqueue: true
    }

    sms
      .send(opts)
      .then(function (resp) {
        resp.should.have.property('SMSMessageData')
        done()
      })
      .catch(done)
  })

  it('sends multiple simple message', function (done) {
    const opts = {
      to: [fixtures.phoneNumber],
      message: 'This is multiple recipients test',
      enqueue: true
    }
    sms
      .send(opts)
      .then(function (resp) {
        resp.should.have.property('SMSMessageData')
        done()
      })
      .catch(done)
  })

  it('sends multiple messages to different receipients', function (done) {
    const opts = [
      {
        to: fixtures.phoneNumber,
        enqueue: true,
        senderId: '34587',
        message: 'This is mulitple recipients test'
      },
      {
        to: [fixtures.phoneNumber],
        enqueue: true,
        senderId: '34587',
        message: 'Send message to multiple recipients'
      },
      {
        to: fixtures.phoneNumber,
        senderId: 1458,
        enqueue: true,
        message: 'returns object with a message of not sent'
      }
    ]
    sms
      .send(opts)
      .then(function (resp) {
        resp[0].should.have.property('SMSMessageData')
        done()
      })
      .catch(done)
  })

  it('sends heavy single message', function (done) {
    this.timeout(55000)
    const count = 1000
    const numbers = Array(count)
      .fill(0)
      .map((num, idx) => `+2547000${count + idx}00`.substring(0, 13))

    const opts = {
      to: numbers,
      message: 'This is heavy single test',
      enqueue: true
    }
    sms
      .send(opts)
      .then(function (resp) {
        resp.should.have.property('SMSMessageData')
        done()
      })
      .catch(done)
  })

  it('sends premium message', function (done) {
    const opts = {
      to: fixtures.phoneNumber,
      from: 'testService',
      message: 'This is premium test',
      keyword: 'test',
      linkId: '76test',
      retryDurationInHours: 1
    }
    sms
      .sendPremium(opts)
      .then(function (resp) {
        resp.should.have.property('SMSMessageData')
        done()
      })
      .catch(done)
  })

  it('rejects premium SMS without keyword', function () {
    const opts = {
      to: fixtures.phoneNumber,
      from: 'service',
      message: 'missing keyword'
    }

    return sms.sendPremium(opts).should.be.rejected()
  })

  it('uses senderId as sender when from is not provided', function () {
    const opts = {
      to: fixtures.phoneNumber,
      senderId: 'ATTEST',
      message: 'senderId test'
    }

    return sms.send(opts).then(function (resp) {
      resp.should.have.property('SMSMessageData')
      resp.SMSMessageData.should.have.property('Recipients').with.lengthOf(1)
      resp.SMSMessageData.Recipients[0].should.have.property('statusCode', 101)
    })
  })

  it('handles partial failure in array send — valid and invalid objects mixed', function () {
    const opts = [
      {
        to: fixtures.phoneNumber,
        enqueue: true,
        message: 'Valid message'
      },
      {
        to: 'NOT_A_PHONE_NUMBER',
        enqueue: true,
        message: 'Invalid recipient'
      }
    ]

    return sms.send(opts).then(function (results) {
      results.should.be.instanceof(Array)
      results.should.have.lengthOf(2)
      // First should succeed
      results[0].should.have.property('SMSMessageData')
      // Second should return the failure shape from Promise.allSettled handler
      results[1].should.have.property('SMSMessageData')
      results[1].SMSMessageData.should.have.property('status', 'failed')
    })
  })
})
