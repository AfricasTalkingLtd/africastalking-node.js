import { Credentials } from '../src/utils/getFullCredentials.types';

// test for: required
export const invalidCredentials1 = {};

// test for: syntax
export const invalidCredentials2 = {
  apiKey: 5,
  username: 6,
  format: 'not-xml-or-json',
};

export const validCredentials: Credentials = {
  apiKey: 'c8c30e0e05dd38aed9a156bf53b8f0f091a79d5eac4740a48e561f3b663683c8',
  username: 'sandbox',
  format: 'json',
};
