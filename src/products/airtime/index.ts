import { sendAirtimeRequest } from './sendAirtimeRequest';
import { Credentials } from '../../utils/getCredentials.interface';

export const AIRTIME = (credentials: Credentials) => ({
  send: sendAirtimeRequest(credentials),
});
