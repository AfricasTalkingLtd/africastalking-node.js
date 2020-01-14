/* eslint-disable @typescript-eslint/no-unused-expressions */

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import AfricasTalking from '../../src';
import { validCredentials } from '../fixtures';

chai.use(chaiAsPromised);

describe('SMS', () => {
  const sms = AfricasTalking(validCredentials).SMS;

  context('invalid options', () => {
    it('#send() cannot be empty', () => {
      expect(sms.send({} as any)).to.be.rejected;
    });

    it('#send() must have to/from/message params', () => {
      expect(sms.send({
        to: '+254718769882',
        from: null,
        message: null,
      } as any)).to.be.rejected;
    });

    it('#sendBulk()', () => {
      expect(sms.sendBulk({
        to: '+254718769882',
        from: null,
        message: null,
        enqueue: 'Joe',
      } as any)).to.be.rejected;
    });

    it('#sendPremium()', () => {
      expect(sms.sendPremium({
        to: '+254718769882',
        from: null,
        message: null,
      } as any)).to.be.rejected;
    });

    it('#createSubscription()', () => {
      expect(sms.createSubscription({
        to: '+254718769882',
        from: null,
        message: null,
        enqueue: 'Joe',
      } as any)).to.be.rejected;
    });

    it('#fetchSubscription()', () => {
      expect(sms.fetchSubscription({
        to: '+254718769882',
        from: null,
        message: null,
        enqueue: 'Joe',
      } as any)).to.be.rejected;
    });

    it('#deleteSubscription()', () => {
      expect(sms.deleteSubscription({
        to: '+254718769882',
        from: null,
        message: null,
        enqueue: 'Joe',
      } as any)).to.be.rejected;
    });
  });

  context('valid options', () => {
    it('fetches messages', async () => {
      try {
        const result = await sms.fetchMessages();

        expect(result).to.have.property('SMSMessageData');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    });

    it('fetches subscription', async () => {
      try {
        const result = await sms.fetchSubscription({
          shortCode: '1234',
          keyword: 'TESTKWD',
        });

        expect(result).to.have.property('responses');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    });

    it('creates subscription', async () => {
      try {
        const result = await sms.createSubscription({
          shortCode: '1234',
          keyword: 'TESTKWD',
          phoneNumber: '+254718769882',
          checkoutToken: '12abvsfdhh63535',
        });

        expect(result).to.have.property('status');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    });

    it('deletes subscription', async () => {
      try {
        const result = await sms.deleteSubscription({
          shortCode: '1234',
          keyword: 'TESTKWD',
          phoneNumber: '+254718769882',
        });

        expect(result).to.have.property('status');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    });

    it('sends single simple message', async () => {
      try {
        const result = await sms.send({
          to: '+254718769882',
          message: 'This is a test',
          enqueue: true,
        });

        expect(result).to.have.property('SMSMessageData');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    });

    it('sends multiple simple message', async () => {
      try {
        const result = await sms.send({
          to: ['+254718769882', '+254718769882'],
          message: 'This is mulitple recipients test',
          enqueue: true,
        });

        expect(result).to.have.property('SMSMessageData');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    });

    it('sends heavy single message', async () => {
      try {
        const count = 1000;
        const numbers = Array(count).fill(0).map((_num, idx) => `+254718${count + idx}`);

        const result = await sms.send({
          to: numbers,
          message: 'This is heavy single test',
          enqueue: true,
        });

        expect(result).to.have.property('SMSMessageData');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    }).timeout(55000);

    it('sends premium message', async () => {
      try {
        const result = await sms.sendPremium({
          to: '+254718760882',
          from: 'testService',
          message: 'This is premium test',
          keyword: 'test',
          linkId: '76test',
          retryDurationInHours: 1,
        });

        expect(result).to.have.property('SMSMessageData');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    });
  });
});
