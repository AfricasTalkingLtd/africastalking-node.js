import { Credentials } from '../../utils/getFullCredentials.types';
import { Payments } from './index.types';
import { bankCheckoutCharge } from './bank/bankCheckoutCharge';
import { bankCheckoutValidate } from './bank/bankCheckoutValidate';
import { bankTransfer } from './bank/bankTransfer';
import { cardCheckoutCharge } from './card/cardCheckoutCharge';
import { cardCheckoutValidate } from './card/cardCheckoutValidate';
import { mobileB2B } from './mobile/mobileB2B';
import { mobileB2C } from './mobile/mobileB2C';
import { mobileCheckout } from './mobile/mobileCheckout';
import { mobileData } from './mobile/mobileData';
import { fetchProductTransactions } from './query/fetchProductTransactions';
import { fetchWalletBalance } from './query/fetchWalletBalance';
import { fetchWalletTransactions } from './query/fetchWalletTransactions';
import { findTransaction } from './query/findTransaction';
import { topupStash } from './topupStash';
import { walletTransfer } from './walletTransfer';
import { showDeprecationWarning } from '../../utils/misc';
import { CONSTANTS } from '../../utils/constants';

// exports 1: types
export { BankCheckoutChargeOptions, BankCheckoutChargeResponse } from './bank/bankCheckoutCharge.types';
export { BankCheckoutValidateOptions, BankCheckoutValidateResponse } from './bank/bankCheckoutValidate.types';
export { BankTransferOptions, BankTransferResponse } from './bank/bankTransfer.types';
export { CardCheckoutChargeOptions, CardCheckoutChargeResponse } from './card/cardCheckoutCharge.types';
export { CardCheckoutValidateOptions, CardCheckoutValidateResponse } from './card/cardCheckoutValidate.types';
export { MobileB2BOptions, MobileB2BResponse } from './mobile/mobileB2B.types';
export { MobileB2COptions, MobileB2CResponse } from './mobile/mobileB2C.types';
export { MobileCheckoutOptions, MobileCheckoutResponse } from './mobile/mobileCheckout.types';
export { MobileDataOptions, MobileDataResponse } from './mobile/mobileData.types';
export { FetchProductTransactionsOptions, FetchProductTransactionsResponse } from './query/fetchProductTransactions.types';
export { FetchWalletBalanceResponse } from './query/fetchWalletBalance.types';
export { FetchWalletTransactionsOptions, FetchWalletTransactionsResponse } from './query/fetchWalletTransactions.types';
export { FindTransactionOptions, FindTransactionResponse } from './query/findTransaction.types';
export { TopupStashOptions, TopupStashResponse } from './topupStash.types';
export { WalletTransferOptions, WalletTransferResponse } from './walletTransfer.types';

// exports 2: pure functions
export { bankCheckoutCharge } from './bank/bankCheckoutCharge';
export { bankCheckoutValidate } from './bank/bankCheckoutValidate';
export { bankTransfer } from './bank/bankTransfer';
export { cardCheckoutCharge } from './card/cardCheckoutCharge';
export { cardCheckoutValidate } from './card/cardCheckoutValidate';
export { mobileB2B } from './mobile/mobileB2B';
export { mobileB2C } from './mobile/mobileB2C';
export { mobileCheckout } from './mobile/mobileCheckout';
export { mobileData } from './mobile/mobileData';
export { fetchProductTransactions } from './query/fetchProductTransactions';
export { fetchWalletBalance } from './query/fetchWalletBalance';
export { fetchWalletTransactions } from './query/fetchWalletTransactions';
export { findTransaction } from './query/findTransaction';
export { topupStash } from './topupStash';
export { walletTransfer } from './walletTransfer';

// exports 3: instance-based functions
export const PAYMENTS = (credentials: Credentials): Payments => ({
  bankCheckoutCharge: bankCheckoutCharge(credentials),
  bankCheckoutValidate: bankCheckoutValidate(credentials),
  bankTransfer: bankTransfer(credentials),

  cardCheckoutCharge: cardCheckoutCharge(credentials),
  cardCheckoutValidate: cardCheckoutValidate(credentials),

  mobileB2B: mobileB2B(credentials),
  mobileB2C: mobileB2C(credentials),
  mobileCheckout: mobileCheckout(credentials),
  mobileData: mobileData(credentials),

  fetchProductTransactions: fetchProductTransactions(credentials),
  fetchWalletBalance: fetchWalletBalance(credentials),
  fetchWalletTransactions: fetchWalletTransactions(credentials),
  findTransaction: findTransaction(credentials),

  topupStash: topupStash(credentials),
  walletTransfer: walletTransfer(credentials),

  get checkout() {
    showDeprecationWarning('PAYMENTS.checkout()', 'PAYMENTS.mobileCheckout()', 'minor');
    return mobileCheckout(credentials);
  },
  get checkOut() {
    showDeprecationWarning('PAYMENTS.checkOut()', 'PAYMENTS.mobileCheckout()', 'minor');
    return mobileCheckout(credentials);
  },
  get payConsumer() {
    showDeprecationWarning('PAYMENTS.payConsumer()', 'PAYMENTS.mobileB2C()', 'minor');
    return mobileB2C(credentials);
  },
  get payBusiness() {
    showDeprecationWarning('PAYMENTS.payBusiness()', 'PAYMENTS.mobileB2B()', 'minor');
    return mobileB2B(credentials);
  },

  ...CONSTANTS,
});
