import 'mocha';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { AfricasTalking } from '../../dist';
import { validCredentials } from '../fixtures';

chai.use(chaiAsPromised);

describe('Application', () => {
  const at = AfricasTalking(validCredentials);

  it('fetched application data', async () => {
    const result = await at.fetchApplicationData();
    expect(result).to.have.property('UserData');
  });
});
