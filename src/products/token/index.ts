import { Token } from './index.types';
import { Credentials } from '../../utils/getFullCredentials.types';
import { createCheckoutToken } from './createCheckoutToken';
import { generateAuthToken } from './generateAuthToken';

// exports 1: types
export { CreateCheckoutTokenOptions, CreateCheckoutTokenResponse } from './createCheckoutToken.types';
export { GenerateAuthTokenResponse } from './generateAuthToken.types';

// exports 2: pure functions
export { createCheckoutToken } from './createCheckoutToken';
export { generateAuthToken } from './generateAuthToken';

// exports 3: instance-based functions
export const TOKEN = (credentials: Credentials): Token => ({
  createCheckoutToken: createCheckoutToken(credentials),
  generateAuthToken: generateAuthToken(credentials),
});
