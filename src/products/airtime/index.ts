import { AirtimeOptions } from './sendAirtimeRequest.interface';
import { FullCredentials } from '../index.interface';
import { sendAirtimeRequest } from './sendAirtimeRequest';

export const AIRTIME = (fullCredentials: FullCredentials) => ({
  send: (options: AirtimeOptions) => sendAirtimeRequest(fullCredentials, options),
});
