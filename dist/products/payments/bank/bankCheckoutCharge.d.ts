import { Credentials } from '../../../utils/getFullCredentials.types';
import { BankCheckoutChargeOptions, BankCheckoutChargeResponse } from './bankCheckoutCharge.types';
export declare const bankCheckoutCharge: (credentials: Credentials) => (options: BankCheckoutChargeOptions) => Promise<BankCheckoutChargeResponse>;
