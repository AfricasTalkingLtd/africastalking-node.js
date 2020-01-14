import { BankCheckoutCharge } from './bank/bankCheckoutCharge.types';
import { BankCheckoutValidate } from './bank/bankCheckoutValidate.types';
import { BankTransfer } from './bank/bankTransfer.types';
import { CardCheckoutCharge } from './card/cardCheckoutCharge.types';
import { CardCheckoutValidate } from './card/cardCheckoutValidate.types';
import { MobileB2B } from './mobile/mobileB2B.types';
import { MobileB2C } from './mobile/mobileB2C.types';
import { MobileCheckout } from './mobile/mobileCheckout.types';
import { MobileData } from './mobile/mobileData.types';
import { FetchProductTransactions } from './query/fetchProductTransactions.types';
import { FetchWalletBalance } from './query/fetchWalletBalance.types';
import { FetchWalletTransactions } from './query/fetchWalletTransactions.types';
import { FindTransaction } from './query/findTransaction.types';
import { TopupStash } from './topupStash.types';
import { WalletTransfer } from './walletTransfer.types';

export interface Payments {
  bankCheckoutCharge: BankCheckoutCharge;
  bankCheckoutValidate: BankCheckoutValidate;
  bankTransfer: BankTransfer;

  cardCheckoutCharge: CardCheckoutCharge;
  cardCheckoutValidate: CardCheckoutValidate;

  mobileB2B: MobileB2B;
  mobileB2C: MobileB2C;
  mobileCheckout: MobileCheckout;
  mobileData: MobileData;

  fetchProductTransactions: FetchProductTransactions;
  fetchWalletBalance: FetchWalletBalance;
  fetchWalletTransactions: FetchWalletTransactions;
  findTransaction: FindTransaction;

  topupStash: TopupStash;
  walletTransfer: WalletTransfer;

  checkout: MobileCheckout;
  checkOut: MobileCheckout;
  payConsumer: MobileB2C;
  payBusiness: MobileB2B;

  REASON: {
    SALARY: 'SalaryPayment';
    SALARY_WITH_CHARGE: 'SalaryPaymentWithWithdrawalChargePaid';
    BUSINESS: 'BusinessPayment';
    BUSINESS_WITH_CHARGE: 'BusinessPaymentWithWithdrawalChargePaid';
    PROMOTION: 'PromotionPayment';
  };
  PROVIDER: {
    ATHENA: 'Athena';
    MPESA: 'Mpesa';
  };
  TRANSFER_TYPE: {
    BUY_GOODS: 'BusinessBuyGoods';
    PAYBILL: 'BusinessPayBill';
    DISBURSE_FUNDS: 'DisburseFundsToBusiness';
    B2B_TRANSFER: 'BusinessToBusinessTransfer';
  };
  BANK: {
    FCMB_NG: 234001;
    ZENITH_NG: 234002;
    ACCESS_NG: 234003;
    GTBANK_NG: 234004;
    ECOBANK_NG: 234005;
    DIAMOND_NG: 234006;
    PROVIDUS_NG: 234007;
    UNITY_NG: 234008;
    STANBIC_NG: 234009;
    STERLING_NG: 234010;
    PARKWAY_NG: 234011;
    AFRIBANK_NG: 234012;
    ENTREPRISE_NG: 234013;
    FIDELITY_NG: 234014;
    HERITAGE_NG: 234015;
    KEYSTONE_NG: 234016;
    SKYE_NG: 234017;
    STANCHART_NG: 234018;
    UNION_NG: 234019;
    UBA_NG: 234020;
    WEMA_NG: 234021;
    FIRST_NG: 234022;
  };
}
