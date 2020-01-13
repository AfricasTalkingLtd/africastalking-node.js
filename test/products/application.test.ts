import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import AfricasTalking from '../../src';
import { validCredentials } from '../fixtures';

chai.use(chaiAsPromised);

describe('Application', () => {
  const application = AfricasTalking(validCredentials).APPLICATION;

  it('fetched application data', async () => {
    try {
      const result = await application.fetchApplicationData();

      expect(result).to.have.property('UserData');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  });
});
