import { MobileCheckoutResponse, MobileCheckoutOptions } from './mobileCheckout.types';
import { Credentials } from '../../../utils/getFullCredentials.types';
export declare const mobileCheckout: (credentials: Credentials) => (options: MobileCheckoutOptions) => Promise<MobileCheckoutResponse>;
