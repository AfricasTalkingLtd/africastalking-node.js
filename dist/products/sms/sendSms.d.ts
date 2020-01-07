import { SmsOptions, SmsResponse } from './sendSms.types';
import { Credentials } from '../../utils/getFullCredentials.types';
export declare const sendSms: (credentials: Credentials) => (options: SmsOptions, isBulk?: boolean, isPremium?: boolean) => Promise<SmsResponse>;
