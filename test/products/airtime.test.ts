/* eslint-disable @typescript-eslint/no-unused-expressions */

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import AfricasTalking from '../../src';
import { validCredentials } from '../fixtures';

chai.use(chaiAsPromised);

describe('Airtime', () => {
  const airtime = AfricasTalking(validCredentials).AIRTIME;

  context('invalid options', () => {
    it('#send() cannot be empty', () => {
      expect(airtime.send({} as any)).to.be.rejected;
    });

    it('#send() must have phoneNumber/currencyCode/amount', () => {
      expect(airtime.send({
        recipients: [{
          phoneNumber: '+254726166685',
        }],
      } as any)).to.be.rejected;
    });

    it('#send() rejects invalid options', () => {
      expect(airtime.send({
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
      try {
        const result = await airtime.send({
          recipients: [
            {
              phoneNumber: '+254726166685',
              currencyCode: 'KES',
              amount: 10,
            },
          ],
        });

        expect(result).to.have.property('responses');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    });

    it('sends airtime to many', async () => {
      try {
        const result = await airtime.send({
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
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    });
  });
});
