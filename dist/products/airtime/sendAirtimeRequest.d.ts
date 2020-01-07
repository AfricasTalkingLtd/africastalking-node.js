import { AirtimeOptions, AirtimeResponse } from './sendAirtimeRequest.types';
import { Credentials } from '../../utils/getFullCredentials.types';
export declare const sendAirtimeRequest: (credentials: Credentials) => (options: AirtimeOptions) => Promise<AirtimeResponse>;
