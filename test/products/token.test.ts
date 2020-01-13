/* eslint-disable @typescript-eslint/no-unused-expressions */

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import AfricasTalking from '../../src';
import { validCredentials } from '../fixtures';

chai.use(chaiAsPromised);

describe('Token', () => {
  const token = AfricasTalking(validCredentials).TOKEN;

  it('creates checkout token', async () => {
    try {
      const result = await token.createCheckoutToken('+254718769882');

      expect(result).to.have.property('token');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  });

  it('generates auth token', async () => {
    try {
      const result = await token.generateAuthToken();

      expect(result).to.have.property('token');
      expect(result).to.have.property('lifetimeInSeconds');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  });
});
