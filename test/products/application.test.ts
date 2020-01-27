import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { APPLICATION } from '../../src';
import { validCredentials } from '../fixtures';

chai.use(chaiAsPromised);

describe('Application', () => {
  const application = APPLICATION(validCredentials);

  it('fetched application data', async () => {
    const result = await application.fetchApplicationData();
    expect(result).to.have.property('UserData');
  });
});
