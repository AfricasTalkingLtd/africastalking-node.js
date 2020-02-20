import { SendAirtimeRequest } from './airtime/sendAirtimeRequest.types';
import { FetchApplicationData } from './application/fetchApplicationData.types';
import { Constants } from '../utils/constants.types';
import { BankCheckoutCharge } from './payments/bank/bankCheckoutCharge.types';
import { BankCheckoutValidate } from './payments/bank/bankCheckoutValidate.types';
import { BankTransfer } from './payments/bank/bankTransfer.types';
import { CardCheckoutCharge } from './payments/card/cardCheckoutCharge.types';
import { CardCheckoutValidate } from './payments/card/cardCheckoutValidate.types';
import { MobileB2B } from './payments/mobile/mobileB2B.types';
import { MobileB2C } from './payments/mobile/mobileB2C.types';
import { MobileCheckout } from './payments/mobile/mobileCheckout.types';
import { MobileData } from './payments/mobile/mobileData.types';
import { FetchProductTransactions } from './payments/query/fetchProductTransactions.types';
import { FetchWalletBalance } from './payments/query/fetchWalletBalance.types';
import { FetchWalletTransactions } from './payments/query/fetchWalletTransactions.types';
import { FindTransaction } from './payments/query/findTransaction.types';
import { TopupStash } from './payments/topupStash.types';
import { WalletTransfer } from './payments/walletTransfer.types';
import { CreateSubscription } from './sms/premiumSubscriptions/createSubscription.types';
import { DeleteSubscription } from './sms/premiumSubscriptions/deleteSubscription.types';
import { FetchSubscription } from './sms/premiumSubscriptions/fetchSubscription.types';
import { FetchMessages } from './sms/fetchMessages.types';
import { CreateCheckoutToken } from './token/createCheckoutToken.types';
import { GenerateAuthToken } from './token/generateAuthToken.types';
import { MakeCall } from './voice/makeCall.types';
import { GetNumQueuedCalls } from './voice/getNumQueuedCalls.types';
import { UploadMediaFile } from './voice/uploadMediaFile.types';
import { UssdHandler, ExpressHandler } from '../utils/expressHandler/expressHandler.types';
import { ActionBuilder } from '../utils';
import { SendPremiumSms, SendBulkSms, SendSms } from './sms/sendMessage.types';

export interface Airtime {
  sendAirtimeRequest: SendAirtimeRequest;

  send: SendAirtimeRequest;
}

export interface Application {
  fetchApplicationData: FetchApplicationData;

  fetchAccount: FetchApplicationData;
}

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

export interface Sms {
  createSubscription: CreateSubscription;
  deleteSubscription: DeleteSubscription;
  fetchSubscription: FetchSubscription;
  fetchMessages: FetchMessages;
  sendSms: SendSms;
  sendBulkSms: SendBulkSms;
  sendPremiumSms: SendPremiumSms;

  send: SendSms;
  sendBulk: SendBulkSms;
  sendPremium: SendPremiumSms;
}


export interface Token {
  createCheckoutToken: CreateCheckoutToken;
  generateAuthToken: GenerateAuthToken;
}

export type Ussd = (handler: UssdHandler) => ExpressHandler[];

export interface Voice {
  ActionBuilder: typeof ActionBuilder;
  makeCall: MakeCall;
  getNumQueuedCalls: GetNumQueuedCalls;
  uploadMediaFile: UploadMediaFile;

  call: MakeCall;
}

export interface AFRICASTALKING {
  AIRTIME: Airtime;
  APPLICATION: Application;
  PAYMENTS: Payments;
  SMS: Sms;
  TOKEN: Token;
  VOICE: Voice;
  USSD: Ussd;

  ACCOUNT: Application;
  PAYMENT: Payments;
}
