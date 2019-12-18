import { Credentials } from '../../utils/getCredentials.interface';
import { mobileCheckout } from './mobile/mobileCheckout';
import { mobileB2C } from './mobile/mobileB2C';
import { mobileB2B } from './mobile/mobileB2B';
import { bankCheckoutCharge } from './bank/bankCheckoutCharge';
import { bankCheckoutValidate } from './bank/bankCheckoutValidate';
import { bankTransfer } from './bank/bankTransfer';
import { walletTransfer } from './walletTransfer';
import { topupStash } from './topupStash';
import { cardCheckoutCharge } from './card/cardCheckoutCharge';
import { cardCheckoutValidate } from './card/cardCheckoutValidate';
import { fetchProductTransactions } from './query/fetchProductTransactions';
import { findTransaction } from './query/findTransaction';

export const PAYMENTS = (credentials: Credentials) => ({
  mobileCheckout: mobileCheckout(credentials),
  mobileB2C: mobileB2C(credentials),
  mobileB2B: mobileB2B(credentials),
  bankCheckoutCharge: bankCheckoutCharge(credentials),
  bankCheckoutValidate: bankCheckoutValidate(credentials),
  bankTransfer: bankTransfer(credentials),
  walletTransfer: walletTransfer(credentials),
  topupStash: topupStash(credentials),
  cardCheckoutCharge: cardCheckoutCharge(credentials),
  cardCheckoutValidate: cardCheckoutValidate(credentials),
  fetchProductTransactions: fetchProductTransactions(credentials),
  findTransaction: findTransaction(credentials),

  // fallbacks
  checkout: mobileCheckout(credentials),
  checkOut: mobileCheckout(credentials),
  payConsumer: mobileB2C(credentials),
  payBusiness: mobileB2B(credentials),
});
