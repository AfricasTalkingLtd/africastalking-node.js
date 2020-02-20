/* eslint-disable @typescript-eslint/no-unused-expressions */

import 'mocha';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Client } from '../../dist';
import { validCredentials } from '../fixtures';

chai.use(chaiAsPromised);

describe('SMS', () => {
  const client = new Client(validCredentials);

  context('invalid options', () => {
    it('#sendSms() cannot be empty', () => {
      expect(client.sendSms({} as any)).to.be.rejected;
    });

    it('#sendSms() must have to/from/message params', () => {
      expect(client.sendSms({
        to: '+254711111111',
        from: null,
        message: null,
      } as any)).to.be.rejected;
    });

    it('#sendBulkSms()', () => {
      expect(client.sendBulkSms({
        to: '+254711111111',
        from: null,
        message: null,
        enqueue: 'Joe',
      } as any)).to.be.rejected;
    });

    it('#sendPremiumSms()', () => {
      expect(client.sendPremiumSms({
        to: '+254711111111',
        from: null,
        message: null,
      } as any)).to.be.rejected;
    });

    it('#createSubscription()', () => {
      expect(client.createSubscription({
        to: '+254711111111',
        from: null,
        message: null,
        enqueue: 'Joe',
      } as any)).to.be.rejected;
    });

    it('#fetchSubscription()', () => {
      expect(client.fetchSubscription({
        to: '+254711111111',
        from: null,
        message: null,
        enqueue: 'Joe',
      } as any)).to.be.rejected;
    });

    it('#deleteSubscription()', () => {
      expect(client.deleteSubscription({
        to: '+254711111111',
        from: null,
        message: null,
        enqueue: 'Joe',
      } as any)).to.be.rejected;
    });
  });

  context('valid options', () => {
    it('fetches messages', async () => {
      const result = await client.fetchMessages();
      expect(result).to.have.property('SMSMessageData');
    });

    it('fetches subscription', async () => {
      const result = await client.fetchSubscription({
        shortCode: '1234',
        keyword: 'TESTKWD',
      });

      expect(result).to.have.property('responses');
    });

    it('creates subscription', async () => {
      const result = await client.createSubscription({
        shortCode: '1234',
        keyword: 'TESTKWD',
        phoneNumber: '+254711111111',
        checkoutToken: '12abvsfdhh63535',
      });

      expect(result).to.have.property('status');
    });

    it('deletes subscription', async () => {
      const result = await client.deleteSubscription({
        shortCode: '1234',
        keyword: 'TESTKWD',
        phoneNumber: '+254711111111',
      });

      expect(result).to.have.property('status');
    });

    it('sends single simple message', async () => {
      const result = await client.sendSms({
        to: '+254711111111',
        message: 'This is a test',
        enqueue: true,
      });

      expect(result).to.have.property('SMSMessageData');
    });

    it('sends multiple simple message', async () => {
      const result = await client.sendSms({
        to: ['+254711111111', '+254711111111'],
        message: 'This is mulitple recipients test',
        enqueue: true,
      });

      expect(result).to.have.property('SMSMessageData');
    });

    it('sends heavy single message', async () => {
      const count = 1000;
      const numbers = Array(count).fill(0).map((_num, idx) => `+254718${count + idx}`);

      const result = await client.sendSms({
        to: numbers,
        message: 'This is heavy single test',
        enqueue: true,
      });

      expect(result).to.have.property('SMSMessageData');
    }).timeout(55000);

    it('sends bulk message', async () => {
      const count = 1000;
      const numbers = Array(count).fill(0).map((_num, idx) => `+254718${count + idx}`);

      const result = await client.sendBulkSms({
        to: numbers,
        message: 'This is heavy single test',
        enqueue: true,
        bulkSMSMode: true,
      });

      expect(result).to.have.property('SMSMessageData');
    });

    it('sends premium message', async () => {
      const result = await client.sendPremiumSms({
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
