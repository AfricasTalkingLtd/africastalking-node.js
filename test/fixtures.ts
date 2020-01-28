import { Credentials } from '../dist';

// test for: required
export const invalidCredentials1 = {};

// test for: syntax
export const invalidCredentials2 = {
  apiKey: 5,
  username: 6,
  format: 'not-xml-or-json',
};

export const validCredentials: Credentials = {
  apiKey: 'YOUR_API_KEY',
  username: 'YOUR_USERNAME',
  format: 'json',
};
