import 'mocha';
import { expect } from 'chai';
import { ActionBuilder } from '../../dist';

describe('ActionBuilder', () => {
  const generateResponseTemplate = (str: string) => `<?xml version="1.0" encoding="UTF-8"?><Response>${str}</Response>`;
  const audioUrl = 'https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3';
  const callbackUrl = 'http://myapp.com/callback';

  let actionBuilder: ActionBuilder;

  beforeEach(() => {
    actionBuilder = new ActionBuilder();
  });

  describe('say', () => {
    context('invalid options', () => {
      it('<Say> cannot be empty', () => {
        expect(() => actionBuilder.say({} as any)).to.throw();
      });
    });

    context('valid options', () => {
      it('creates <Say> with text only', () => {
        actionBuilder.say('Hello world');

        expect(actionBuilder.build()).to.equal(generateResponseTemplate(
          '<Say>Hello world</Say>',
        ));
      });

      it('creates <Say> with text, optional parameters', () => {
        actionBuilder.say('Hello world', {
          voice: 'woman',
          playBeep: true,
        });

        expect(actionBuilder.build()).to.equal(generateResponseTemplate(
          '<Say voice="woman" playBeep="true">Hello world</Say>',
        ));
      });
    });
  });

  describe('play', () => {
    context('invalid options', () => {
      it('<Play> must have url', () => {
        expect(() => actionBuilder.play('')).to.throw();
      });
    });

    context('valid options', () => {
      it('creates valid <Play>', () => {
        actionBuilder.play(audioUrl);

        expect(actionBuilder.build()).to.equal(generateResponseTemplate(
          `<Play url="${audioUrl}"/>`,
        ));
      });
    });
  });

  describe('getDigits', () => {
    context('invalid options', () => {
      it('<GetDigits> must have <Say> or <Play> child', () => {
        expect(() => actionBuilder.getDigits({} as any)).to.throw();
      });

      it('cannot have invalid child', () => {
        expect(() => actionBuilder.getDigits({
          dial: { phoneNumbers: '+254711111111' },
        } as any)).to.throw();
      });
    });

    context('valid options', () => {
      it('creates <GetDigits> with <Play> child', () => {
        actionBuilder.getDigits({
          play: { url: audioUrl },
        });

        expect(actionBuilder.build()).to.equal(generateResponseTemplate(
          `<GetDigits><Play url="${audioUrl}"/></GetDigits>`,
        ));
      });

      it('creates <GetDigits> with <Say> child', () => {
        actionBuilder.getDigits({
          say: { text: 'Hello world' },
        });

        expect(actionBuilder.build()).to.equal(generateResponseTemplate(
          '<GetDigits><Say>Hello world</Say></GetDigits>',
        ));
      });

      it('creates <GetDigits> with <Say> child, optional parameters', () => {
        actionBuilder.getDigits({
          say: { text: 'Hello world' },
        }, {
          callbackUrl,
          numDigits: 1,
          timeout: 30,
          finishOnKey: '#',
        });

        expect(actionBuilder.build()).to.equal(generateResponseTemplate(
          `<GetDigits callbackUrl="${callbackUrl}" numDigits="1" timeout="30" finishOnKey="#"><Say>Hello world</Say></GetDigits>`,
        ));
      });
    });
  });

  describe('dial', () => {
    context('invalid options', () => {
      it('<Dial> must have phoneNumbers', () => {
        expect(() => actionBuilder.dial('')).to.throw();
      });
    });

    context('valid options', () => {
      const phoneNumbers = '+254711111111,+254733YYYZZZ,test@ke.sip.africastalking.com';

      it('creates <Dial> with phoneNumbers', () => {
        actionBuilder.dial(phoneNumbers);

        expect(actionBuilder.build()).to.equal(generateResponseTemplate(
          `<Dial phoneNumbers="${phoneNumbers}"/>`,
        ));
      });

      it('creates <Dial> with phoneNumbers, optional params', () => {
        actionBuilder.dial(phoneNumbers, {
          record: true,
          sequential: true,
          callerId: '+254711222333',
          ringBackTone: audioUrl,
          maxDuration: 120,
        });

        expect(actionBuilder.build()).to.equal(generateResponseTemplate(
          `<Dial record="true" sequential="true" callerId="+254711222333" ringBackTone="${audioUrl}" maxDuration="120" phoneNumbers="${phoneNumbers}"/>`,
        ));
      });
    });
  });

  describe('record', () => {
    context('invalid options', () => {
      it('<Record> must have <Say> or <Play> child', () => {
        expect(() => actionBuilder.record({} as any)).to.throw();
      });

      it('cannot have invalid child', () => {
        expect(() => actionBuilder.record({
          dial: { phoneNumbers: '+254711111111' },
        } as any)).to.throw();
      });
    });

    context('valid options', () => {
      it('creates <Record> with <Play> child', () => {
        actionBuilder.record({
          play: { url: audioUrl },
        });

        expect(actionBuilder.build()).to.equal(generateResponseTemplate(
          `<Record><Play url="${audioUrl}"/></Record>`,
        ));
      });

      it('creates <Record> with <Say> child', () => {
        actionBuilder.record({
          say: { text: 'Hello world' },
        });

        expect(actionBuilder.build()).to.equal(generateResponseTemplate(
          '<Record><Say>Hello world</Say></Record>',
        ));
      });

      it('creates <Record> with optional parameters', () => {
        actionBuilder.record({
          say: { text: 'Hello world' },
        }, {
          finishOnKey: '#',
          maxLength: 120,
          timeout: 3600,
          trimSilence: true,
          playBeep: true,
          callbackUrl,
        });

        expect(actionBuilder.build()).to.equal(generateResponseTemplate(
          `<Record finishOnKey="#" maxLength="120" timeout="3600" trimSilence="true" playBeep="true" callbackUrl="${callbackUrl}"><Say>Hello world</Say></Record>`,
        ));
      });
    });
  });

  describe('enqueue', () => {
    context('valid options', () => {
      it('creates valid <Enqueue>', () => {
        actionBuilder.enqueue();

        expect(actionBuilder.build()).to.equal(generateResponseTemplate(
          '<Enqueue/>',
        ));
      });

      it('creates valid <Enqueue> with optional parameters', () => {
        actionBuilder.enqueue({
          holdMusic: audioUrl,
          name: 'support',
        });

        expect(actionBuilder.build()).to.equal(generateResponseTemplate(
          `<Enqueue holdMusic="${audioUrl}" name="support"/>`,
        ));
      });
    });
  });

  describe('dequeue', () => {
    context('invalid options', () => {
      it('<Dequeue> must have a phoneNumber', () => {
        expect(() => actionBuilder.dequeue('')).to.throw();
      });
    });

    context('valid options', () => {
      const phoneNumber = '+254711222333';

      it('creates <Dequeue> with phoneNumber', () => {
        actionBuilder.dequeue(phoneNumber);

        expect(actionBuilder.build()).to.equal(generateResponseTemplate(
          `<Dequeue phoneNumber="${phoneNumber}"/>`,
        ));
      });

      it('creates <Dequeue> with phoneNumber and name', () => {
        actionBuilder.dequeue(phoneNumber, {
          name: 'support',
        });

        expect(actionBuilder.build()).to.equal(generateResponseTemplate(
          `<Dequeue name="support" phoneNumber="${phoneNumber}"/>`,
        ));
      });
    });
  });

  describe('Redirect', () => {
    context('invalid options', () => {
      it('<Redirect> cannot be empty', () => {
        expect(() => actionBuilder.redirect('')).to.throw();
      });

      it('<Redirect> text must be valid url', () => {
        expect(() => actionBuilder.redirect('Not a valid url')).to.throw();
      });
    });

    context('valid options', () => {
      const redirectUrl = 'http://myredirecturl.com/rdrct';

      it('creates valid <Redirect> given url', () => {
        actionBuilder.redirect(redirectUrl);

        expect(actionBuilder.build()).to.equal(generateResponseTemplate(
          `<Redirect>${redirectUrl}</Redirect>`,
        ));
      });
    });
  });

  describe('Conference', () => {
    context('valid options', () => {
      it('creates valid <Conference>', () => {
        actionBuilder.conference();

        expect(actionBuilder.build()).to.equal(generateResponseTemplate(
          '<Conference/>',
        ));
      });
    });
  });

  describe('Reject', () => {
    context('valid options', () => {
      it('creates valid <Reject>', () => {
        actionBuilder.reject();

        expect(actionBuilder.build()).to.equal(generateResponseTemplate(
          '<Reject/>',
        ));
      });
    });
  });
});
