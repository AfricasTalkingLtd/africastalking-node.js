import { SmsOptions, SmsResponse } from './sendSms.types';
import { Credentials } from '../../utils/getFullCredentials.types';
export declare const sendSms: (credentials: Credentials) => (opts: SmsOptions) => Promise<SmsResponse>;
export declare const sendBulk: (credentials: Credentials) => (opts: SmsOptions) => Promise<SmsResponse>;
export declare const sendPremium: (credentials: Credentials) => (opts: SmsOptions) => Promise<SmsResponse>;
