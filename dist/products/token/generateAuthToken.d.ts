import { Credentials } from '../../utils/getFullCredentials.types';
import { GenerateAuthTokenResponse } from './generateAuthToken.types';
export declare const generateAuthToken: (credentials: Credentials) => () => Promise<GenerateAuthTokenResponse>;
