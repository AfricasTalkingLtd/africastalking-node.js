import { Credentials } from '../utils/getFullCredentials.types';
import { AFRICASTALKING } from './index.types';
import { showDeprecationWarning } from '../utils/misc';
import { airtime } from './airtime';
import { application } from './application';
import { payments } from './payments';
import { sms } from './sms';
import { token } from './token';
import { voice } from './voice';
import { ussd } from './ussd';

export const AfricasTalking = (credentials: Credentials): AFRICASTALKING => ({
  AIRTIME: airtime(credentials),
  APPLICATION: application(credentials),
  PAYMENTS: payments(credentials),
  SMS: sms(credentials),
  TOKEN: token(credentials),
  VOICE: voice(credentials),
  USSD: ussd,

  // fallbacks
  get ACCOUNT() {
    showDeprecationWarning('AfricasTalking().ACCOUNT', 'AfricasTalking().APPLICATION', 'minor');
    return application(credentials);
  },
  get PAYMENT() {
    showDeprecationWarning('AfricasTalking().PAYMENT', 'AfricasTalking().PAYMENTS', 'minor');
    return payments(credentials);
  },
});
