import { SMS } from './sms';
import { APPLICATION } from './application';
import { AIRTIME } from './airtime';
import { Credentials } from '../utils/getCredentials.interface';
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

export const AfricasTalking2 = (credentials: Credentials) => ({
  ...AIRTIME(credentials),
  ...APPLICATION(credentials),
  ...SMS(credentials),
  ...PAYMENTS(credentials),
});

// const credentials = { apiKey: 'xx', username: 'sandbox' };
// const at = AfricasTalking2(credentials);
// // const client = AfricasTalking(credentials).APPLICATION;

// at.fetchApplicationData()
//   .then(result => {
//     console.log(result.UserData.balance);
//   });
