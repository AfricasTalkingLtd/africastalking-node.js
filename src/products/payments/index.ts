import { Credentials } from '../../utils/getCredentials.interface';
import { mobileCheckout } from './mobileCheckout';
import { mobileB2C } from './mobileB2C';

export const PAYMENTS = (credentials: Credentials) => ({
  mobileCheckout: mobileCheckout(credentials),
  mobileB2C: mobileB2C(credentials),

  // fallbacks
  checkout: mobileCheckout(credentials),
  checkOut: mobileCheckout(credentials),
  payConsumer: mobileB2C(credentials),
});
