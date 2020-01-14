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

export const payments = (credentials: Credentials): Payments => ({
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

  // fallbacks
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

  // constants
  REASON: {
    SALARY: 'SalaryPayment',
    SALARY_WITH_CHARGE: 'SalaryPaymentWithWithdrawalChargePaid',
    BUSINESS: 'BusinessPayment',
    BUSINESS_WITH_CHARGE: 'BusinessPaymentWithWithdrawalChargePaid',
    PROMOTION: 'PromotionPayment',
  },
  PROVIDER: {
    ATHENA: 'Athena',
    MPESA: 'Mpesa',
  },
  TRANSFER_TYPE: {
    BUY_GOODS: 'BusinessBuyGoods',
    PAYBILL: 'BusinessPayBill',
    DISBURSE_FUNDS: 'DisburseFundsToBusiness',
    B2B_TRANSFER: 'BusinessToBusinessTransfer',
  },
  BANK: {
    FCMB_NG: 234001,
    ZENITH_NG: 234002,
    ACCESS_NG: 234003,
    GTBANK_NG: 234004,
    ECOBANK_NG: 234005,
    DIAMOND_NG: 234006,
    PROVIDUS_NG: 234007,
    UNITY_NG: 234008,
    STANBIC_NG: 234009,
    STERLING_NG: 234010,
    PARKWAY_NG: 234011,
    AFRIBANK_NG: 234012,
    ENTREPRISE_NG: 234013,
    FIDELITY_NG: 234014,
    HERITAGE_NG: 234015,
    KEYSTONE_NG: 234016,
    SKYE_NG: 234017,
    STANCHART_NG: 234018,
    UNION_NG: 234019,
    UBA_NG: 234020,
    WEMA_NG: 234021,
    FIRST_NG: 234022,
  },
});
