import config from 'config';
import { Credentials } from '../../dist';

// test for: required
export const invalidCredentials1 = {};

// test for: syntax
export const invalidCredentials2 = {
  apiKey: 5,
  username: 6,
  format: 'not-xml-or-json',
};

export const validCredentials: Credentials = config.get('credentials');
