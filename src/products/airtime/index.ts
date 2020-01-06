import { sendAirtimeRequest } from './sendAirtimeRequest';
import { Credentials } from '../../utils/getFullCredentials.d';

export const AIRTIME = (credentials: Credentials) => ({
  send: sendAirtimeRequest(credentials),
});
