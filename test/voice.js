'use strict';

const should   = require('should');
const validate = require('validate.js');
const fixtures = require('./fixtures.local');

var AfricasTalking, voice;

describe('Voice', function () {

    this.timeout(15000);

    before(function () {
        AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT);
        voice = AfricasTalking.VOICE;
    });

    describe('Actions', function () {
        describe('Say', function () {
            let options = {};
            let expected;

            describe('validation', function () {
                it('<Say> cannot be empty', function () {
                    (function () { voice.Say({}) })
                        .should.throw(Error);
                });
            });

            it('creates <Say> with text only', function () {
                options.text = 'Hello there';
                expected = '<Say>Hello there</Say>';

                voice.Say(options)
                    .should.equal(expected);
            });

            it('creates <Say> with text, optional parameters', function () {
                Object.assign(options, {
                    voice: 'woman',
                    playBeep: true
                });
                expected = '<Say voice="woman" playBeep="true">Hello there</Say>';

                voice.Say(options)
                    .should.equal(expected);
            });
        });

        describe('Play', function () {
            let options = {};
            let expected;

            describe('validation', function () {
                it('<Play> must have url', function () {
                    (function () { voice.Play({}) })
                        .should.throw(Error);
                });
            });

            it('creates valid <Play>', function () {
                options.url = 'http://www.myvoicemailserver.com/audio/vmail.wav';
                expected = '<Play url="http://www.myvoicemailserver.com/audio/vmail.wav"/>';

                voice.Play(options)
                    .should.equal(expected);
            });
        });

        describe('GetDigits', function () {
            let options = {};
            let expected;

            describe('validation', function () {
                it('<GetDigits> must have <Say> or <Play> child', function () {
                    (function () { voice.GetDigits({}) })
                        .should.throw(Error);
                });

                it('cannot have invalid child', function () {
                    options.text = voice.Dial({ phoneNumbers: '+254711XXXYYY' });

                    (function () { voice.GetDigits(options) })
                        .should.throw(Error);
                });
            });

            it('creates <GetDigits> with <Play> child', function () {
                options.text = voice.Play({ url: "http://www.myvoicemailserver.com/audio/vmail.wav" });
                expected = '<GetDigits><Play url="http://www.myvoicemailserver.com/audio/vmail.wav"/></GetDigits>';

                voice.GetDigits(options)
                    .should.equal(expected);
            });

            it('creates <GetDigits> with <Say> child', function () {
                options.text = voice.Say({ text: "Hello" });
                expected = '<GetDigits numDigits="1" ><Say>Hello</Say></GetDigits>';

                voice.GetDigits(options)
                    .should.equal(expected);
            });

            it('creates <GetDigits> with <Say> child, optional parameters', function () {
                Object.assign(options, {
                    numDigits: 1,
                    timeout: 30,
                    finishOnKey: "#",
                    callbackUrl: "http://myapp.com/callback"
                });
                expected = '<GetDigits numDigits="1" timeout="30" finishOnKey="#" \
            callbackUrl="http://myapp.com/callback" ><Say>Hello</Say></GetDigits>';

                voice.GetDigits(options)
                    .should.equal(expected);
            });
        });

        describe('Dial', function () {
            let options = {};
            let expected;

            describe('validation', function () {
                it('<Dial> must have phoneNumbers', function () {
                    (function () { voice.Dial({}) })
                        .should.throw(Error);
                });
            });

            it('creates <Dial> with phoneNumbers', function () {
                options.phoneNumbers = '+254711XXXYYY,+254733YYYZZZ,test@ke.sip.africastalking.com';
                expected = '<Dial phoneNumbers="+254711XXXYYY,+254733YYYZZZ,test@ke.sip.africastalking.com"/>'

                voice.Dial(options)
                    .should.equal(expected);
            });

            it('creates <Dial> with phoneNumbers, optional params', function () {
                Object.assign(options, {
                    record: true,
                    sequential: true,
                    callerId: '+254711222333',
                    ringBackTone: 'http://mymediafile.com/playme.mp3',
                    maxDuration: 120
                });
                expected = '<Dial phoneNumbers="+254711XXXYYY,+254733YYYZZZ,test@ke.sip.africastalking.com" ' +
                'record="true" sequential="true" callerId="+254711222333" ringBackTone="http://mymediafile.com/playme.mp3" maxDuration="120"/>'

                voice.Dial(options)
                    .should.equal(expected);
            });
        });

        describe('Record', function () {
            let options = {};
            let expected;

            describe('validation', function () {
                it('<Record> must have <Say> or <Play> child', function () {
                    (function () { voice.Record({}) })
                        .should.throw(Error);
                });

                it('cannot have invalid child', function () {
                    options.text = voice.Dial({ phoneNumbers: '+254711XXXYYY' });

                    (function () { voice.Record(options) })
                        .should.throw(Error);
                });
            });

            it('creates <Record> with <Play> child', function () {
                options.text = voice.Play({ url: "http://www.myvoicemailserver.com/audio/vmail.wav" });
                expected = '<Record><Play url="http://www.myvoicemailserver.com/audio/vmail.wav"/></Record>';

                voice.Record(options)
                    .should.equal(expected);
            });

            it('creates <Record> with <Say> child', function () {
                options.text = voice.Say({ text: "Hello" });
                expected = '<Record><Say>Hello</Say></Record>';

                voice.Record(options)
                    .should.equal(expected);
            });

            it('creates <Record> with optional parameters', function () {
                Object.assign(options, {
                    finishOnKey: "#",
                    maxLength: 120,
                    timeout: 3600,
                    trimSilence: true,
                    playBeep: true,
                    callbackUrl: "http://myapp.com/callback"
                });
                expected = '<Record finishOnKey="#" maxLengh="120" timeout="3600" \
            trimSilence="true" playBeep="true" callBackUrl="http://myapp.com/callback">\
            <Say>Hello</Say></Record>';

                voice.Record(options)
                    .should.equal(expected);
            });
        });

        describe('Enqueue', function () {
            let options = {};
            let expected;

            it('creates valid <Enqueue>', function () {
                expected = '<Enqueue/>';

                voice.Enqueue(options)
                    .should.equal(expected);
            });

            it('creates <Enqueue> with optional parameters', function () {
                options.holdMusic = 'http://www.mymediaserver.com/audio/callWaiting.wav';
                options.name = 'support';
                expected = '<Enqueue holdMusic="http://www.mymediaserver.com/audio/callWaiting.wav" name="support"/>';

                voice.Enqueue(options)
                    .should.equal(expected);
            });
        });

        describe('Dequeue', function () {
            let options = {};
            let expected;

            describe('validation', function () {
                it('<Dequeue> must have a phoneNumber', function () {
                    (function () { voice.Dequeue({}) })
                        .should.throw(Error);
                });
            });

            it('creates <Dequeue> with phoneNumber', function () {
                options.phoneNumber = '+254711222333';
                expected = '<Dequeue phoneNumber="+254711222333"/>';

                voice.Dequeue(options)
                    .should.equal(expected);
            });

            it('creates <Dequeue> with phoneNumber and name', function () {
                options.name = 'support';
                expected = '<Dequeue phoneNumber="+254711222333" name="support"/>';

                voice.Dequeue(options)
                    .should.equal(expected);
            });
        });

        describe('Redirect', function () {
            let options = {};
            let expected;

            describe('validation', function () {
                it('<Redirect> cannot be empty', function () {
                    (function () { voice.Redirect({}) })
                        .should.throw(Error);
                });

                it('<Redirect> text must be valid url', function () {
                    options.text = 'Hello is not url';

                    (function () { voice.Redirect(options) })
                        .should.throw(Error);
                });
            });

            it('creates valid <Redirect> given url', function () {
                options.text = 'http://myredirecturl.com/rdrct';
                expected = '<Redirect>http://myredirecturl.com/rdrct</Redirect>'

                voice.Redirect(options)
                    .should.equal(expected);
            });
        });

        describe('Conference', function () {
            let expected = '<Conference/>'
            it('creates valid <Conference>', function () {
                voice.Conference()
                    .should.equal(expected);
            });
        });

        describe('Reject', function () {
            let expected = '<Reject/>'
            it('creates valid <Reject>', function () {
                voice.Reject()
                    .should.equal(expected);
            });
        });
    });
});
