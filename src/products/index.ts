import { Credentials } from '../utils/getFullCredentials.types';
import { AFRICASTALKING } from './index.types';
import { showDeprecationWarning } from '../utils/misc';
import { AIRTIME } from './airtime';
import { APPLICATION } from './application';
import { PAYMENTS } from './payments';
import { SMS } from './sms';
import { TOKEN } from './token';
import { USSD } from './ussd';
import { VOICE } from './voice';

// exports 1: types & pure functions
export * from './airtime';
export * from './application';
export * from './payments';
export * from './sms';
export * from './token';
export * from './ussd';
export * from './voice';

// exports 2: instance-based functions
export const AfricasTalking = (credentials: Credentials): AFRICASTALKING => ({
  AIRTIME: AIRTIME(credentials),
  APPLICATION: APPLICATION(credentials),
  PAYMENTS: PAYMENTS(credentials),
  SMS: SMS(credentials),
  TOKEN: TOKEN(credentials),
  USSD,
  VOICE: VOICE(credentials),

  get ACCOUNT() {
    showDeprecationWarning('AfricasTalking().ACCOUNT', 'AfricasTalking().APPLICATION', 'minor');
    return APPLICATION(credentials);
  },
  get PAYMENT() {
    showDeprecationWarning('AfricasTalking().PAYMENT', 'AfricasTalking().PAYMENTS', 'minor');
    return PAYMENTS(credentials);
  },
});

// export const AfricasTalkingFuture = (credentials: Credentials) => ({
//   ...AIRTIME(credentials),
//   ...APPLICATION(credentials),
//   ...PAYMENTS(credentials),
//   ...SMS(credentials),
//   ...TOKEN(credentials),
//   ...USSD,
//   ...VOICE(credentials),
// });


// import { makeCall, ...a } from './voice';

// TODO: the future!!!!
// import * as as from './sms';

// export const AfricasTalkingFuture = (credentials: Credentials) => {
//   let final = {};

//   Object.entries(as).forEach(([key, value]) => {
//     final[key] = value(credentials);
//   })

//   return final;
// };
