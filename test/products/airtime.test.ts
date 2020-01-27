/* eslint-disable @typescript-eslint/no-unused-expressions */

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { AIRTIME } from '../../src';
import { validCredentials } from '../fixtures';

chai.use(chaiAsPromised);

describe('Airtime', () => {
  const airtime = AIRTIME(validCredentials);

  context('invalid options', () => {
    it('#send() cannot be empty', () => {
      expect(airtime.sendAirtimeRequest({} as any)).to.be.rejected;
    });

    it('#send() must have phoneNumber/currencyCode/amount', () => {
      expect(airtime.sendAirtimeRequest({
        recipients: [{
          phoneNumber: '+254726166685',
        }],
      } as any)).to.be.rejected;
    });

    it('#send() rejects invalid options', () => {
      expect(airtime.sendAirtimeRequest({
        recipients: [{
          phoneNumber: 'not phone',
          currencyCode: '',
          amount: 'NaN',
        }],
      } as any)).to.be.rejected;
    });
  });

  context('valid options', () => {
    it('sends airtime to one', async () => {
      const result = await airtime.sendAirtimeRequest({
        recipients: [
          {
            phoneNumber: '+254726166685',
            currencyCode: 'KES',
            amount: 10,
          },
        ],
      });

      expect(result).to.have.property('responses');
    });

    it('sends airtime to many', async () => {
      const result = await airtime.sendAirtimeRequest({
        recipients: [
          {
            phoneNumber: '+254726166685',
            currencyCode: 'KES',
            amount: 90,
          },
          {
            phoneNumber: '+254726863825',
            currencyCode: 'KES',
            amount: 897,
          },
        ],
      });

      expect(result).to.have.property('responses');
    });
  });
});
