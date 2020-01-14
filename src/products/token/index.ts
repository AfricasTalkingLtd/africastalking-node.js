import { Token } from './index.types';
import { Credentials } from '../../utils/getFullCredentials.types';
import { createCheckoutToken } from './createCheckoutToken';
import { generateAuthToken } from './generateAuthToken';

export const token = (credentials: Credentials): Token => ({
  createCheckoutToken: createCheckoutToken(credentials),
  generateAuthToken: generateAuthToken(credentials),
});
