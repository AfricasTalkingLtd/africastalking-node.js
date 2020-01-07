import { Credentials } from '../../../utils/getFullCredentials.types';
import { CardCheckoutChargeOptions, CardCheckoutChargeResponse } from './cardCheckoutCharge.types';
export declare const cardCheckoutCharge: (credentials: Credentials) => (options: CardCheckoutChargeOptions) => Promise<CardCheckoutChargeResponse>;
