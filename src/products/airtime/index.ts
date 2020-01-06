import { sendAirtimeRequest } from './sendAirtimeRequest';
import { Credentials } from '../../utils/getFullCredentials.types';

export const AIRTIME = (credentials: Credentials) => ({
  send: sendAirtimeRequest(credentials),
});
