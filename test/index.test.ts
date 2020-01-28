/* eslint-disable @typescript-eslint/no-unused-expressions */

import 'mocha';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { AfricasTalking } from '../dist';
import { invalidCredentials1, invalidCredentials2, validCredentials } from './fixtures';

chai.use(chaiAsPromised);

describe('Initialization', () => {
  context('credentials', () => {
    it('throws error if missing credentials', async () => {
      expect(
        AfricasTalking(invalidCredentials1 as any).sendSms({} as any),
      ).to.be.rejected;
    });

    it('throws error if invalid credentials', async () => {
      expect(
        AfricasTalking(invalidCredentials2 as any).sendSms({} as any),
      ).to.be.rejected;
    });

    it('passes credential validation', () => {
      expect(
        AfricasTalking(validCredentials).sendSms({} as any),
      ).to.be.rejectedWith('"message" is required');
    });
  });
});
