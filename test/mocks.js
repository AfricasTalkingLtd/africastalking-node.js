const mockSms = (nock) => {
  nock('https://api.sandbox.africastalking.com')
    .post('/version1/messaging')
    .times(6)
    .reply(201, {
      SMSMessageData: {
        Message: 'Sent to 1/1 Total Cost: KES 0.8000',
        Recipients: [{
          statusCode: 101,
          number: '+254711XXXYYY',
          status: 'Success',
          cost: 'KES 0.8000',
          messageId: 'ATPid_SampleTxnId123'
        }]
      }
    })

  nock('https://api.sandbox.africastalking.com')
    .get(/\/version1\/messaging\?.+/)
    .reply(200, {
      SMSMessageData: {
        Messages: [{
          linkId: 'SampleLinkId123',
          text: 'Hello',
          to: '28901',
          id: 15071,
          date: '2018-03-19T08:34:18.445Z',
          from: '+254711XXXYYY'
        }]
      }
    })

  nock('https://api.sandbox.africastalking.com')
    .get(/\/version1\/subscription\?.+/)
    .reply(200, {
      responses: []
    })

  nock('https://api.sandbox.africastalking.com')
    .post('/version1/subscription/create')
    .reply(201, {
      status: 'Success'
    })

  nock('https://api.sandbox.africastalking.com')
    .post('/version1/subscription/delete')
    .reply(200, {
      status: 'Success'
    })
}

const mockToken = (nock) => {
  nock('https://api.sandbox.africastalking.com')
    .post('/auth-token/generate')
    .reply(200, {
      token: 'AT_some_token',
      lifetimeInSeconds: 3600
    })

  nock('https://api.sandbox.africastalking.com')
    .post('/auth-token/generate')
    .reply(200, { token: 'None', description: 'Invalid credentials' })

  nock('https://api.sandbox.africastalking.com')
    .post('/auth-token/generate')
    .replyWithError('Network failure')
}

const mockAirtime = (nock) => {
  nock('https://api.sandbox.africastalking.com')
    .post('/version1/airtime/send')
    .times(2)
    .reply(201, {
      errorMessage: 'None',
      numSent: 1,
      totalAmount: 'KES 1000.0000',
      totalDiscount: 'KES 40.0000',
      responses: [{
        phoneNumber: '+254711XXXYYY',
        errorMessage: 'None',
        amount: 'KES 1000.0000',
        status: 'Sent',
        requestId: 'ATQid_1be914ac47845eef1a1dab5d89ec50ff',
        discount: 'KES 40.0000'
      }]
    })

  nock('https://api.sandbox.africastalking.com')
    .get(/\/query\/transaction\/find\?.+/)
    .reply(200, {
      status: 'Success'
    })
}

const mockApplication = (nock) => {
  nock('https://api.sandbox.africastalking.com')
    .get('/version1/user?username=sandbox')
    .times(2)
    .reply(200, {
      UserData: {
        balance: 'KES 1785.50'
      }
    })
}

const mockInsights = (nock) => {
  nock('https://insights.sandbox.africastalking.com')
    .post('/v1/sim-swap')
    .reply(200, {
      status: 'Processed',
      transactionId: 'AT_some_id'
    })
}

const mockWhatsApp = (nock) => {
  nock('https://chat.sandbox.africastalking.com')
    .post('/whatsapp/message/send')
    .reply(200, {
      phoneNumber: '+25471111111',
      status: 'SENT',
      messageId: 'AT_some_id'
    })

  nock('https://chat.sandbox.africastalking.com')
    .post('/whatsapp/template/send')
    .reply(200, {
      status: 'Success',
      templateId: 'AT_some_id',
      templateStatus: 'Pending'
    })
}

const mockMobileData = (nock) => {
  nock('https://bundles.sandbox.africastalking.com')
    .post('/mobile/data/request')
    .times(2)
    .reply(200, {
      entries: [{
        phoneNumber: '+254714978532',
        provider: 'Safaricom',
        status: 'Queued',
        transactionId: 'ATPid_8df0ca90660d981ff9059454672496c2',
        value: 'KES 20.0000'
      }]
    })

  nock('https://bundles.sandbox.africastalking.com')
    .get(/\/query\/transaction\/find\?.+/)
    .reply(200, {
      status: 'Success',
      data: {
        requestMetadata: {
          reason: 'Testing things...'
        },
        sourceType: 'Wallet',
        source: 'PaymentWallet',
        provider: 'Safaricom',
        destinationType: 'PhoneNumber',
        description: 'MobileData Payment Request for 10GB',
        providerChannel: 'MobileData',
        transactionFee: 'KES 1.0000',
        providerMetadata: {
          recipientIsRegistered: 'true',
          recipientName: '254724XXXYYY - John Doe'
        },
        status: 'Success',
        productName: 'testing',
        category: 'MobileData',
        transactionDate: '12.05.2018 21:46:13',
        destination: '+254708663158',
        value: 'KES 2900.0000',
        transactionId: 'ATPid_b9379b671fee8ccf24b2c74f94da0ceb',
        creationTime: '2018-05-12 18:46:12'
      }
    })

  nock('https://bundles.sandbox.africastalking.com')
    .get(/\/query\/wallet\/balance\?.+/)
    .reply(200, {
      status: 'Success',
      balance: 'KES 19'

    })
}

module.exports = () => {
  if (process.env.NO_NOCK) {
    return
  }

  const nock = require('nock')
  nock.disableNetConnect()
  nock.enableNetConnect('127.0.0.1')

  mockSms(nock)
  mockToken(nock)
  mockAirtime(nock)
  mockWhatsApp(nock)
  mockInsights(nock)
  mockMobileData(nock)
  mockApplication(nock)
}
