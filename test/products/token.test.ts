/* eslint-disable @typescript-eslint/no-unused-expressions */

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { TOKEN } from '../../src';
import { validCredentials } from '../fixtures';

chai.use(chaiAsPromised);

describe('Token', () => {
  const token = TOKEN(validCredentials);

  it('creates checkout token', async () => {
    const result = await token.createCheckoutToken('+254718769882');
    expect(result).to.have.property('token');
  });

  it('generates auth token', async () => {
    const result = await token.generateAuthToken();

    expect(result).to.have.property('token');
    expect(result).to.have.property('lifetimeInSeconds');
  });
});
