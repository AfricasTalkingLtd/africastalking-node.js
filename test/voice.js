'use strict'

const fixtures = require('./fixtures')

let AfricasTalking, voice

describe('Voice', function () {
  before(function () {
    AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT)
    voice = AfricasTalking.VOICE
  })

  describe('validation', function () {
    it('#call rejects because of atleast one invalid phone number', () => {
      const options = {
        callFrom: '+254711xxxxxx',
        callTo: '+25471234567890,+254705',
        clientRequestId: 'your-cool-id'
      }
      return voice.call(options).should.be.rejected()
    })
  })

  describe('Action builders', function () {
    let response
    const responseTemplate = '<?xml version="1.0" encoding="UTF-8"?><Response>'

    this.timeout(15000)

    beforeEach(function () { // eslint-disable-line no-undef
      response = new voice.ActionBuilder()
    })
    describe('say', function () {
      let expected, options

      describe('validation', function () {
        it('<Say> cannot be empty', function () {
          (function () { response.say() })
            .should.throw(Error)
        })
      })

      it('creates <Say> with text only', function () {
        expected = responseTemplate +
                    '<Say>Hello there</Say>' +
                    '</Response>'

        response.say('Hello there')
          .build()
          .should.equal(expected)
      })

      it('creates <Say> with text, optional parameters', function () {
        options = {
          voice: 'woman',
          playBeep: true
        }
        expected = responseTemplate +
                    '<Say voice="woman" playBeep="true">Hello there</Say>' +
                    '</Response>'

        response.say('Hello there', options)
          .build()
          .should.equal(expected)
      })
    })

    describe('play', function () {
      let expected

      describe('validation', function () {
        it('<Play> must have url', function () {
          (function () { response.play() })
            .should.throw(Error)
        })
      })

      it('creates valid <Play>', function () {
        expected = responseTemplate +
                '<Play url="https://www.myresponsemailserver.com/audio/vmail.wav"/>' +
                '</Response>'

        response.play('https://www.myresponsemailserver.com/audio/vmail.wav')
          .build()
          .should.equal(expected)
      })
    })

    describe('getDigits', function () {
      let expected, child, options

      describe('validation', function () {
        it('<GetDigits> must have <Say> or <Play> child', function () {
          (function () { response.getDigits() })
            .should.throw()
        })

        it('cannot have invalid child', function () {
          child = {
            dial: { phoneNumbers: '+254711XXXYYY' }
          };

          (function () { response.getDigits(child).build() })
            .should.throw()
        })
      })

      it('creates <GetDigits> with <Play> child', function () {
        child = {
          play: { url: 'https://www.myresponsemailserver.com/audio/vmail.wav' }
        }
        expected = responseTemplate +
                '<GetDigits><Play url="https://www.myresponsemailserver.com/audio/vmail.wav"/></GetDigits>' +
                '</Response>'

        response.getDigits(child)
          .build()
          .should.equal(expected)
      })

      it('creates <GetDigits> with <Say> child', function () {
        child = {
          say: { text: 'Hello there' }
        }
        expected = responseTemplate +
                '<GetDigits><Say>Hello there</Say></GetDigits>' +
                '</Response>'

        response.getDigits(child)
          .build()
          .should.equal(expected)
      })

      it('creates <GetDigits> with <Say> child, optional parameters', function () {
        child = {
          say: { text: 'Hello there' }
        }
        options = {
          numDigits: 1,
          timeout: 30,
          finishOnKey: '#',
          callbackUrl: 'https://myapp.com/callback'
        }
        expected = responseTemplate +
                '<GetDigits numDigits="1" timeout="30" finishOnKey="#" ' +
                'callbackUrl="https://myapp.com/callback"><Say>Hello there</Say></GetDigits>' +
                '</Response>'

        response.getDigits(child, options)
          .build()
          .should.equal(expected)
      })
    })

    describe('dial', function () {
      let expected, options

      describe('validation', function () {
        it('<Dial> must have phoneNumbers', function () {
          (function () { response.dial() })
            .should.throw(Error)
        })
      })

      it('creates <Dial> with phoneNumbers', function () {
        expected = responseTemplate +
                '<Dial phoneNumbers="+254711XXXYYY,+254733YYYZZZ,test@ke.sip.africastalking.com"/>' +
                '</Response>'

        response.dial('+254711XXXYYY,+254733YYYZZZ,test@ke.sip.africastalking.com')
          .build()
          .should.equal(expected)
      })

      it('creates <Dial> with phoneNumbers, optional params', function () {
        options = {
          record: true,
          sequential: true,
          callerId: '+254711222333',
          ringBackTone: 'https://mymediafile.com/playme.mp3',
          maxDuration: 120
        }
        expected = responseTemplate +
                '<Dial record="true" sequential="true" callerId="+254711222333" ' +
                'ringBackTone="https://mymediafile.com/playme.mp3" maxDuration="120" ' +
                'phoneNumbers="+254711XXXYYY,+254733YYYZZZ,test@ke.sip.africastalking.com"/>' +
                '</Response>'

        response.dial('+254711XXXYYY,+254733YYYZZZ,test@ke.sip.africastalking.com', options)
          .build()
          .should.equal(expected)
      })
    })

    describe('record', function () {
      let expected, child, options

      describe('validation', function () {
        it('<Record> must have <Say> or <Play> child', function () {
          (function () { response.record() })
            .should.throw(Error)
        })

        it('cannot have invalid child', function () {
          child = {
            dial: { phoneNumbers: '+254711XXXYYY' }
          };

          (function () { response.record(child).build() })
            .should.throw(Error)
        })
      })

      it('creates <Record> with <Play> child', function () {
        child = {
          play: { url: 'https://www.myresponsemailserver.com/audio/vmail.wav' }
        }
        expected = responseTemplate +
                '<Record><Play url="https://www.myresponsemailserver.com/audio/vmail.wav"/></Record>' +
                '</Response>'

        response.record(child)
          .build()
          .should.equal(expected)
      })

      it('creates <Record> with <Say> child', function () {
        child = {
          say: { text: 'Hello there' }
        }
        expected = responseTemplate +
                '<Record><Say>Hello there</Say></Record>' +
                '</Response>'

        response.record(child)
          .build()
          .should.equal(expected)
      })

      it('creates <Record> with optional parameters', function () {
        child = {
          say: { text: 'Hello there' }
        }
        options = {
          finishOnKey: '#',
          maxLength: 120,
          timeout: 3600,
          trimSilence: true,
          playBeep: true,
          callbackUrl: 'https://myapp.com/callback'
        }
        expected = responseTemplate +
                '<Record finishOnKey="#" maxLength="120" timeout="3600" ' +
                'trimSilence="true" playBeep="true" callbackUrl="https://myapp.com/callback">' +
                '<Say>Hello there</Say></Record></Response>'

        response.record(child, options)
          .build()
          .should.equal(expected)
      })
    })

    describe('enqueue', function () {
      let expected, options

      it('creates valid <Enqueue>', function () {
        expected = responseTemplate +
                '<Enqueue/>' +
                '</Response>'

        response.enqueue()
          .build()
          .should.equal(expected)
      })

      it('creates <Enqueue> with optional parameters', function () {
        options = {
          holdMusic: 'https://www.mymediaserver.com/audio/callWaiting.wav',
          name: 'support'
        }
        expected = responseTemplate +
                '<Enqueue holdMusic="https://www.mymediaserver.com/audio/callWaiting.wav" name="support"/>' +
                '</Response>'

        response.enqueue(options)
          .build()
          .should.equal(expected)
      })
    })

    describe('dequeue', function () {
      let expected, options

      describe('validation', function () {
        it('<Dequeue> must have a phoneNumber', function () {
          (function () { response.dequeue() })
            .should.throw(Error)
        })
      })

      it('creates <Dequeue> with phoneNumber', function () {
        expected = responseTemplate +
                '<Dequeue phoneNumber="+254711222333"/>' +
                '</Response>'

        response.dequeue('+254711222333')
          .build()
          .should.equal(expected)
      })

      it('creates <Dequeue> with phoneNumber and name', function () {
        options = { name: 'support' }
        expected = responseTemplate +
                '<Dequeue name="support" phoneNumber="+254711222333"/>' +
                '</Response>'

        response.dequeue('+254711222333', options)
          .build()
          .should.equal(expected)
      })
    })

    describe('Redirect', function () {
      let expected

      describe('validation', function () {
        it('<Redirect> cannot be empty', function () {
          (function () { response.redirect() })
            .should.throw(Error)
        })

        it('<Redirect> text must be valid url', function () {
          (function () { response.redirect('Hello is not url') })
            .should.throw(Error)
        })
      })

      it('creates valid <Redirect> given url', function () {
        expected = responseTemplate +
                '<Redirect>https://myredirecturl.com/rdrct</Redirect>' +
                '</Response>'

        response.redirect('https://myredirecturl.com/rdrct')
          .build()
          .should.equal(expected)
      })
    })

    describe('Conference', function () {
      const expected = responseTemplate + '<Conference/></Response>'

      it('creates valid <Conference>', function () {
        response.conference()
          .build()
          .should.equal(expected)
      })
    })

    describe('Reject', function () {
      const expected = responseTemplate + '<Reject/></Response>'

      it('creates valid <Reject>', function () {
        response.reject()
          .build()
          .should.equal(expected)
      })
    })
  })
})
