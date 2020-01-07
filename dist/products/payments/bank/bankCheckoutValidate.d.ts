import { Credentials } from '../../../utils/getFullCredentials.types';
import { BankCheckoutValidateOptions, BankCheckoutValidateResponse } from './bankCheckoutValidate.types';
export declare const bankCheckoutValidate: (credentials: Credentials) => (options: BankCheckoutValidateOptions) => Promise<BankCheckoutValidateResponse>;
