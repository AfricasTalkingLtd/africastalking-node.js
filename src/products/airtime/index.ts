import { FullCredentials } from '../index.interface';
import { sendAirtimeRequest } from './sendAirtimeRequest';

export const AIRTIME = (fullCredentials: FullCredentials) => ({
  send: sendAirtimeRequest(fullCredentials),
});
