import { Credentials } from '../../utils/getCredentials.interface';
import { mobileCheckout } from './mobileCheckout';
import { mobileB2C } from './mobileB2C';
import { mobileB2B } from './mobileB2B';
import { bankCheckoutCharge } from './bankCheckoutCharge';
import { bankCheckoutValidate } from './bankCheckoutValidate';
import { bankTransfer } from './bankTransfer';

export const PAYMENTS = (credentials: Credentials) => ({
  mobileCheckout: mobileCheckout(credentials),
  mobileB2C: mobileB2C(credentials),
  mobileB2B: mobileB2B(credentials),
  bankCheckoutCharge: bankCheckoutCharge(credentials),
  bankCheckoutValidate: bankCheckoutValidate(credentials),
  bankTransfer: bankTransfer(credentials),

  // fallbacks
  checkout: mobileCheckout(credentials),
  checkOut: mobileCheckout(credentials),
  payConsumer: mobileB2C(credentials),
  payBusiness: mobileB2B(credentials),
});
