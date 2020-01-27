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
import { Constants } from '../../utils/constants.types';

export interface Payments extends Constants {
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
}
