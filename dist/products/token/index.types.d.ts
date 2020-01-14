import { CreateCheckoutToken } from './createCheckoutToken.types';
import { GenerateAuthToken } from './generateAuthToken.types';
export interface Token {
    createCheckoutToken: CreateCheckoutToken;
    generateAuthToken: GenerateAuthToken;
}
