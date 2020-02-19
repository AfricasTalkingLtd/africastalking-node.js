import 'mocha';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Client } from '../../dist';
import { validCredentials } from '../fixtures';

chai.use(chaiAsPromised);

describe('Application', () => {
  const client = new Client(validCredentials);

  it('fetched application data', async () => {
    const result = await client.fetchApplicationData();
    expect(result).to.have.property('UserData');
  });
});
