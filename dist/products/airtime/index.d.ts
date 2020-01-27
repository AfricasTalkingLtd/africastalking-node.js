import { Airtime } from './index.types';
import { Credentials } from '../../utils/getFullCredentials.types';
export { SendAirtimeOptions, SendAirtimeResponse } from './sendAirtimeRequest.types';
export { sendAirtimeRequest } from './sendAirtimeRequest';
export declare const AIRTIME: (credentials: Credentials) => Airtime;
