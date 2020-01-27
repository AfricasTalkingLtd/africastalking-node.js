import { Token } from './index.types';
import { Credentials } from '../../utils/getFullCredentials.types';
export { CreateCheckoutTokenOptions, CreateCheckoutTokenResponse } from './createCheckoutToken.types';
export { GenerateAuthTokenResponse } from './generateAuthToken.types';
export { createCheckoutToken } from './createCheckoutToken';
export { generateAuthToken } from './generateAuthToken';
export declare const TOKEN: (credentials: Credentials) => Token;
