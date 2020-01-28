/* eslint-disable @typescript-eslint/no-unused-expressions */

import 'mocha';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { AfricasTalking } from '../../dist';
import { validCredentials } from '../fixtures';

chai.use(chaiAsPromised);

describe('Token', () => {
  const at = AfricasTalking(validCredentials);

  it('creates checkout token', async () => {
    const result = await at.createCheckoutToken('+254718769882');
    expect(result).to.have.property('token');
  });

  it('generates auth token', async () => {
    const result = await at.generateAuthToken();

    expect(result).to.have.property('token');
    expect(result).to.have.property('lifetimeInSeconds');
  });
});
