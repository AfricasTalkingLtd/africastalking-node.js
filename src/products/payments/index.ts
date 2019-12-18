import { Credentials } from '../../utils/getCredentials.interface';
import { mobileCheckout } from './mobileCheckout';

export const PAYMENTS = (credentials: Credentials) => ({
  mobileCheckout: mobileCheckout(credentials),

  // fallbacks
  checkout: mobileCheckout(credentials),
  checkOut: mobileCheckout(credentials),
});
