'use strict'

const joi = require('joi')
// const nock = require('nock')
const fixtures = require('./fixtures')

describe('WhatsApp', function () {
  const phoneNumber = '+25471111111'

  // before(() => {
  //   nock.disableNetConnect()
  // })

  // after(() => {
  //   nock.enableNetConnect()
  // })

  it('sends a message', function (done) {
    const AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT)

    // const scope = nock('https://chat.sandbox.africastalking.com')
    //   .post('/whatsapp/message/send')
    //   .reply(200, {
    //     phoneNumber,
    //     status: 'SENT',
    //     messageId: 'AT_some_id'
    //   })

    const p = AfricasTalking.WHATSAPP.send({
      phoneNumber,
      waNumber: '+1234567890',
      body: { message: 'test' }
    })
    joi.assert(p, joi.object().instance(Promise))

    p.then(function (resp) {
      resp.should.have.property('status')
      resp.should.have.property('messageId')
      resp.should.have.property('phoneNumber')
      // scope.cleanAll()
      done()
    })
      .catch((ex) => {
        // scope.cleanAll()
        if (ex.messageId) {
          done()
        } else {
          done(new Error(ex))
        }
      })
  })

  it('sends a template', function (done) {
    const AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT)

    // const scope = nock('https://chat.sandbox.africastalking.com')
    //   .get('/whatsapp/template/send')
    //   .reply(200, {
    //     status: 'Success',
    //     templateId: 'AT_some_id',
    //     templateStatus: 'Pending'
    //   })

    const p = AfricasTalking.WHATSAPP.sendTemplate({
      waNumber: '+1234567890',
      name: 'amazing_offer',
      language: 'en',
      category: 'UTILITY',
      components: {
        header: {
          type: 'HEADER',
          format: 'TEXT',
          text: 'Offer {{1}}',
          example: {
            header_text: ['12345678']
          }
        },
        body: {
          type: 'BODY',
          text: '{{1}}, Get your free drink if you order using code {{2}}',
          example: {
            body_text: [
              'John',
              '12345678'
            ]
          }
        },
        footer: {
          type: 'FOOTER',
          text: 'Thank you for using our service.'
        },
        buttons: [
          {
            type: 'PHONE_NUMBER',
            text: 'Contact Us',
            phoneNumber: '+9876543210'
          },
          {
            type: 'URL',
            text: 'Talk to A Representative',
            url: 'https://coolurl.fake/contact',
            example: [
              'https://coolurl.fake/contact'
            ]
          }
        ]
      }
    })
    joi.assert(p, joi.object().instance(Promise))

    p.then(function (resp) {
      resp.should.have.property('status')
      resp.should.have.property('templateId')
      resp.should.have.property('templateStatus')
      // scope.cleanAll()
      done()
    })
      .catch((ex) => {
        // scope.cleanAll()
        if (ex.templateId) {
          done()
        } else {
          done(new Error(ex))
        }
      })
  })
})
