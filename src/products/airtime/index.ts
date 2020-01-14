import { Airtime } from './index.types';
import { Credentials } from '../../utils/getFullCredentials.types';
import { sendAirtimeRequest } from './sendAirtimeRequest';

export const airtime = (credentials: Credentials): Airtime => ({
  send: sendAirtimeRequest(credentials),
});
