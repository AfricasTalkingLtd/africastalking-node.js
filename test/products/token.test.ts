/* eslint-disable @typescript-eslint/no-unused-expressions */

import 'mocha';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Client } from '../../dist';
import { validCredentials } from '../fixtures';

chai.use(chaiAsPromised);

describe('Token', () => {
  const client = new Client(validCredentials);

  it('creates checkout token', async () => {
    const result = await client.createCheckoutToken('+254711111111');
    expect(result).to.have.property('token');
  });

  it('generates auth token', async () => {
    const result = await client.generateAuthToken();

    expect(result).to.have.property('token');
    expect(result).to.have.property('lifetimeInSeconds');
  });
});
