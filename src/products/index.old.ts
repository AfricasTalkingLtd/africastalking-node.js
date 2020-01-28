import { Credentials } from '../utils/getFullCredentials.types';
import { showDeprecationWarning } from '../utils/misc';
import { CONSTANTS, ActionBuilder, expressHandler } from '../utils';
import {
  Application, Airtime, Payments, Sms, Token, Ussd, Voice, AFRICASTALKING,
} from './index.old.types';
import { sendAirtimeRequest } from './airtime';
import { fetchApplicationData } from './application';
import {
  bankCheckoutCharge, bankCheckoutValidate, bankTransfer, cardCheckoutCharge,
  cardCheckoutValidate, mobileB2B, mobileB2C, mobileCheckout, mobileData,
  fetchProductTransactions, fetchWalletBalance, fetchWalletTransactions,
  findTransaction, topupStash, walletTransfer,
} from './payments';
import {
  createSubscription, deleteSubscription, fetchSubscription, fetchMessages,
  sendSms, sendBulk, sendPremium,
} from './sms';
import { createCheckoutToken, generateAuthToken } from './token';
import { makeCall, getNumQueuedCalls, uploadMediaFile } from './voice';

const AIRTIME = (credentials: Credentials): Airtime => ({
  sendAirtimeRequest: sendAirtimeRequest(credentials),

  get send() {
    showDeprecationWarning('AIRTIME.send()', 'AIRTIME.sendAirtimeRequest()', 'minor');
    return sendAirtimeRequest(credentials);
  },
});

const APPLICATION = (credentials: Credentials): Application => ({
  fetchApplicationData: fetchApplicationData(credentials),

  get fetchAccount() {
    showDeprecationWarning('APPLICATION.fetchAccount()', 'APPLICATION.fetchApplicationData()', 'minor');
    return fetchApplicationData(credentials);
  },
});

const PAYMENTS = (credentials: Credentials): Payments => ({
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

const SMS = (credentials: Credentials): Sms => ({
  createSubscription: createSubscription(credentials),
  deleteSubscription: deleteSubscription(credentials),
  fetchSubscription: fetchSubscription(credentials),
  fetchMessages: fetchMessages(credentials),
  sendSms: sendSms(credentials),
  sendBulk: sendBulk(credentials),
  sendPremium: sendPremium(credentials),

  get send() {
    showDeprecationWarning('SMS.send()', 'SMS.sendSms()', 'minor');
    return sendSms(credentials);
  },
});

const TOKEN = (credentials: Credentials): Token => ({
  createCheckoutToken: createCheckoutToken(credentials),
  generateAuthToken: generateAuthToken(credentials),
});

const USSD: Ussd = expressHandler;

const VOICE = (credentials: Credentials): Voice => ({
  ActionBuilder,
  makeCall: makeCall(credentials),
  getNumQueuedCalls: getNumQueuedCalls(credentials),
  uploadMediaFile: uploadMediaFile(credentials),

  get call() {
    showDeprecationWarning('VOICE.call()', 'VOICE.makeCall()', 'minor');
    return makeCall(credentials);
  },
});

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
