import { SMS } from './sms';
import { APPLICATION } from './application';
import { AIRTIME } from './airtime';
import { Credentials } from '../utils/getFullCredentials.types';
import { PAYMENTS } from './payments';
import { TOKEN } from './token';

export const AfricasTalking = (credentials: Credentials) => ({
  AIRTIME: AIRTIME(credentials),
  APPLICATION: APPLICATION(credentials),
  SMS: SMS(credentials),
  PAYMENTS: PAYMENTS(credentials),
  TOKEN: TOKEN(credentials),
  // VOICE,
  // USSD,

  // fallbacks
  ACCOUNT: APPLICATION(credentials),
  PAYMENT: PAYMENTS(credentials),
});
