/* eslint-disable @typescript-eslint/no-unused-expressions */

import 'mocha';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { AfricasTalking } from '../../dist';
import { validCredentials } from '../fixtures';

chai.use(chaiAsPromised);

describe('SMS', () => {
  const at = AfricasTalking(validCredentials);

  context('invalid options', () => {
    it('#send() cannot be empty', () => {
      expect(at.sendSms({} as any)).to.be.rejected;
    });

    it('#send() must have to/from/message params', () => {
      expect(at.sendSms({
        to: '+254718769882',
        from: null,
        message: null,
      } as any)).to.be.rejected;
    });

    it('#sendBulk()', () => {
      expect(at.sendBulk({
        to: '+254718769882',
        from: null,
        message: null,
        enqueue: 'Joe',
      } as any)).to.be.rejected;
    });

    it('#sendPremium()', () => {
      expect(at.sendPremium({
        to: '+254718769882',
        from: null,
        message: null,
      } as any)).to.be.rejected;
    });

    it('#createSubscription()', () => {
      expect(at.createSubscription({
        to: '+254718769882',
        from: null,
        message: null,
        enqueue: 'Joe',
      } as any)).to.be.rejected;
    });

    it('#fetchSubscription()', () => {
      expect(at.fetchSubscription({
        to: '+254718769882',
        from: null,
        message: null,
        enqueue: 'Joe',
      } as any)).to.be.rejected;
    });

    it('#deleteSubscription()', () => {
      expect(at.deleteSubscription({
        to: '+254718769882',
        from: null,
        message: null,
        enqueue: 'Joe',
      } as any)).to.be.rejected;
    });
  });

  context('valid options', () => {
    it('fetches messages', async () => {
      const result = await at.fetchMessages();
      expect(result).to.have.property('SMSMessageData');
    });

    it('fetches subscription', async () => {
      const result = await at.fetchSubscription({
        shortCode: '1234',
        keyword: 'TESTKWD',
      });

      expect(result).to.have.property('responses');
    });

    it('creates subscription', async () => {
      const result = await at.createSubscription({
        shortCode: '1234',
        keyword: 'TESTKWD',
        phoneNumber: '+254718769882',
        checkoutToken: '12abvsfdhh63535',
      });

      expect(result).to.have.property('status');
    });

    it('deletes subscription', async () => {
      const result = await at.deleteSubscription({
        shortCode: '1234',
        keyword: 'TESTKWD',
        phoneNumber: '+254718769882',
      });

      expect(result).to.have.property('status');
    });

    it('sends single simple message', async () => {
      const result = await at.sendSms({
        to: '+254718769882',
        message: 'This is a test',
        enqueue: true,
      });

      expect(result).to.have.property('SMSMessageData');
    });

    it('sends multiple simple message', async () => {
      const result = await at.sendSms({
        to: ['+254718769882', '+254718769882'],
        message: 'This is mulitple recipients test',
        enqueue: true,
      });

      expect(result).to.have.property('SMSMessageData');
    });

    it('sends heavy single message', async () => {
      const count = 1000;
      const numbers = Array(count).fill(0).map((_num, idx) => `+254718${count + idx}`);

      const result = await at.sendSms({
        to: numbers,
        message: 'This is heavy single test',
        enqueue: true,
      });

      expect(result).to.have.property('SMSMessageData');
    }).timeout(55000);

    it('sends premium message', async () => {
      const result = await at.sendPremium({
        to: '+254718760882',
        from: 'testService',
        message: 'This is premium test',
        keyword: 'test',
        linkId: '76test',
        retryDurationInHours: 1,
      });

      expect(result).to.have.property('SMSMessageData');
    });
  });
});
