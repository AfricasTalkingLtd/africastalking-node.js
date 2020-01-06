import { Credentials } from '../../utils/getFullCredentials.types';
import { generateAuthToken } from './generateAuthToken';
import { createCheckoutToken } from './createCheckoutToken';

export const TOKEN = (credentials: Credentials) => ({
  generateAuthToken: generateAuthToken(credentials),
  createCheckoutToken: createCheckoutToken(credentials),
});
