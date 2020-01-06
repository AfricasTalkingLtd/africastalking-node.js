import { SMS } from './sms';
import { APPLICATION } from './application';
import { AIRTIME } from './airtime';
import { Credentials } from '../utils/getFullCredentials.d';
import { PAYMENTS } from './payments';

export const AfricasTalking = (credentials: Credentials) => ({
  AIRTIME: AIRTIME(credentials),
  APPLICATION: APPLICATION(credentials),
  SMS: SMS(credentials),
  PAYMENTS: PAYMENTS(credentials),
  // VOICE,
  // TOKEN,
  // USSD,

  // fallbacks
  ACCOUNT: APPLICATION(credentials),
  PAYMENT: PAYMENTS(credentials),
});
