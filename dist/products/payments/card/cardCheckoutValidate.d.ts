import { Credentials } from '../../../utils/getFullCredentials.types';
import { CardCheckoutValidateOptions, CardCheckoutValidateResponse } from './cardCheckoutValidate.types';
export declare const cardCheckoutValidate: (credentials: Credentials) => (options: CardCheckoutValidateOptions) => Promise<CardCheckoutValidateResponse>;
