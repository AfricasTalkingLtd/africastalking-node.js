'use strict';

var should = require('should');
var fixtures = require('./fixtures');

var AfricasTalking, sms;

describe('SMS', function () {
  this.timeout(5000);

  before(function () {
    AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT);
    sms = AfricasTalking.SMS;
  });

  describe('validation', function () {
    var options = {};

    it('#send() cannot be empty', function () {
      return sms.send(options).should.be.rejected();
    });

    it('#send() must have to/from/message params', function () {
      options.to = fixtures.phoneNumber;
      options.from = null;
      options.message = null;

      return sms.send(options).should.be.rejected();
    });

    it('#sendBulk()', function () {
      options.enqueue = 'Joe';
      return sms.sendBulk(options).should.be.rejected();
    });

    it('#sendPremium()', function () {
      return sms.sendPremium(options).should.be.rejected();
    });

    it('#createSubscription()', function () {
      return sms.createSubscription(options).should.be.rejected();
    });

    it('#fetchSubscription()', function () {
      return sms.fetchSubscription(options).should.be.rejected();
    });

    it('#deleteSubscription()', function () {
      return sms.deleteSubscription(options).should.be.rejected();
    });
  });

  it('fetches messages', function (done) {
    sms
      .fetchMessages()
      .then(function (messages) {
        messages.should.have.property('SMSMessageData');
        done();
      })
      .catch(function (error) {
        console.error(error);
        done();
      });
  });

  it('fetches subscription', function (done) {
    const opts = {
      shortCode: '1234',
      keyword: 'TESTKWD',
    };

    sms
      .fetchSubscription(opts)
      .then(function (subscriptions) {
        subscriptions.should.have.property('responses');
        done();
      })
      .catch(function (error) {
        console.error(error);
        done();
      });
  });

  it('creates subscription', function (done) {
    const opts = {
      shortCode: '1234',
      keyword: 'TESTKWD',
      phoneNumber: fixtures.phoneNumber,
    };

    sms
      .createSubscription(opts)
      .then(function (resp) {
        resp.should.have.property('status');
        done();
      })
      .catch(function (error) {
        console.error(error);
        done();
      });
  });

  it('deletes subscription', function (done) {
    const opts = {
      shortCode: '1234',
      keyword: 'TESTKWD',
      phoneNumber: fixtures.phoneNumber,
    };

    sms
      .deleteSubscription(opts)
      .then(function (resp) {
        resp.should.have.property('status');
        done();
      })
      .catch(function (error) {
        console.error(error);
        done();
      });
  });

  it('sends single simple message', function (done) {
    var opts = {
      to: fixtures.phoneNumber,
      message: 'This is a test',
      enqueue: true,
    };

    sms
      .send(opts)
      .then(function (resp) {
        resp.should.have.property('SMSMessageData');
        done();
      })
      .catch(function (err) {
        console.error(err);
        done();
      });
  });

  it('sends multiple simple message', function (done) {
    var opts = {
      to: [fixtures.phoneNumber],
      message: 'This is mulitple recipients test',
      enqueue: true,
    };
    sms
      .send(opts)
      .then(function (resp) {
        resp.should.have.property('SMSMessageData');
        done();
      })
      .catch(function (err) {
        console.error(err);
        done();
      });
  });

  it('sends multiple messages to different receipients', function (done) {
    const opts = [
      {
        to: fixtures.phoneNumber,
        enqueue: true,
        from: '34587',
        message: 'This is mulitple recipients test',
      },
      {
        to: [fixtures.phoneNumber],
        enqueue: true,
        from: '34587',
        message: 'Send message to multiple recipients',
      },
      {
        to: fixtures.phoneNumber,
        from: 1458,
        enqueue: true,
        message: 'returns object with a message of not sent',
      },
    ];
    sms
      .send(opts)
      .then(function (resp) {
        resp[0].should.have.property('SMSMessageData');
        done();
      })
      .catch(function (err) {
        console.error(err);
        done();
      });
  });

  it('sends heavy single message', function (done) {
    this.timeout(55000);
    const count = 1000;
    const numbers = Array(count)
      .fill(0)
      .map((num, idx) => `+254000${count + idx}`);
    const opts = {
      to: numbers,
      message: 'This is heavy single test',
      enqueue: true,
    };
    sms
      .send(opts)
      .then(function (resp) {
        resp.should.have.property('SMSMessageData');
        done();
      })
      .catch(function (err) {
        done(error);
      });
  });

  it('sends premium message', function (done) {
    var opts = {
      to: fixtures.phoneNumber,
      from: 'testService',
      message: 'This is premium test',
      keyword: 'test',
      linkId: '76test',
      retryDurationInHours: 1,
    };
    sms
      .sendPremium(opts)
      .then(function (resp) {
        resp.should.have.property('SMSMessageData');
        done();
      })
      .catch(function (err) {
        console.error(err);
        done();
      });
  });
});
