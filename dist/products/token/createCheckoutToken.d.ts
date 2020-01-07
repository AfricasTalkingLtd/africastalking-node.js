import { Credentials } from '../../utils/getFullCredentials.types';
import { CreateCheckoutTokenResponse } from './createCheckoutToken.types';
export declare const createCheckoutToken: (credentials: Credentials) => (phoneNumber: string) => Promise<CreateCheckoutTokenResponse>;
