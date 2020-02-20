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
  sendSms, sendPremiumSms,
} from './sms';
import { createCheckoutToken, generateAuthToken } from './token';
import { makeCall, getNumQueuedCalls, uploadMediaFile } from './voice';

const AIRTIME = (credentials: Credentials): Airtime => ({
  get sendAirtimeRequest() {
    showDeprecationWarning('AfricasTalking().AIRTIME.sendAirtimeRequest()', 'new Client().sendAirtimeRequest()', 'minor');
    return sendAirtimeRequest(credentials);
  },

  get send() {
    showDeprecationWarning('AfricasTalking().AIRTIME.send()', 'new Client().sendAirtimeRequest()', 'minor');
    return sendAirtimeRequest(credentials);
  },
});

const APPLICATION = (credentials: Credentials): Application => ({
  get fetchApplicationData() {
    showDeprecationWarning('AfricasTalking().APPLICATION.fetchApplicationData()', 'new Client().fetchApplicationData()', 'minor');
    return fetchApplicationData(credentials);
  },

  get fetchAccount() {
    showDeprecationWarning('AfricasTalking().APPLICATION.fetchAccount()', 'new Client().fetchApplicationData()', 'minor');
    return fetchApplicationData(credentials);
  },
});

const PAYMENTS = (credentials: Credentials): Payments => ({
  get bankCheckoutCharge() {
    showDeprecationWarning('AfricasTalking().PAYMENTS.bankCheckoutCharge()', 'new Client().bankCheckoutCharge()', 'minor');
    return bankCheckoutCharge(credentials);
  },
  get bankCheckoutValidate() {
    showDeprecationWarning('AfricasTalking().PAYMENTS.bankCheckoutValidate()', 'new Client().bankCheckoutValidate()', 'minor');
    return bankCheckoutValidate(credentials);
  },
  get bankTransfer() {
    showDeprecationWarning('AfricasTalking().PAYMENTS.bankTransfer()', 'new Client().bankTransfer()', 'minor');
    return bankTransfer(credentials);
  },

  get cardCheckoutCharge() {
    showDeprecationWarning('AfricasTalking().PAYMENTS.cardCheckoutCharge()', 'new Client().cardCheckoutCharge()', 'minor');
    return cardCheckoutCharge(credentials);
  },
  get cardCheckoutValidate() {
    showDeprecationWarning('AfricasTalking().PAYMENTS.cardCheckoutValidate()', 'new Client().cardCheckoutValidate()', 'minor');
    return cardCheckoutValidate(credentials);
  },

  get mobileB2B() {
    showDeprecationWarning('AfricasTalking().PAYMENTS.mobileB2B()', 'new Client().mobileB2B()', 'minor');
    return mobileB2B(credentials);
  },
  get mobileB2C() {
    showDeprecationWarning('AfricasTalking().PAYMENTS.mobileB2C()', 'new Client().mobileB2C()', 'minor');
    return mobileB2C(credentials);
  },
  get mobileCheckout() {
    showDeprecationWarning('AfricasTalking().PAYMENTS.mobileCheckout()', 'new Client().mobileCheckout()', 'minor');
    return mobileCheckout(credentials);
  },
  get mobileData() {
    showDeprecationWarning('AfricasTalking().PAYMENTS.mobileData()', 'new Client().mobileData()', 'minor');
    return mobileData(credentials);
  },

  get fetchProductTransactions() {
    showDeprecationWarning('AfricasTalking().PAYMENTS.fetchProductTransactions()', 'new Client().fetchProductTransactions()', 'minor');
    return fetchProductTransactions(credentials);
  },
  get fetchWalletBalance() {
    showDeprecationWarning('AfricasTalking().PAYMENTS.fetchWalletBalance()', 'new Client().fetchWalletBalance()', 'minor');
    return fetchWalletBalance(credentials);
  },
  get fetchWalletTransactions() {
    showDeprecationWarning('AfricasTalking().PAYMENTS.fetchWalletTransactions()', 'new Client().fetchWalletTransactions()', 'minor');
    return fetchWalletTransactions(credentials);
  },
  get findTransaction() {
    showDeprecationWarning('AfricasTalking().PAYMENTS.findTransaction()', 'new Client().findTransaction()', 'minor');
    return findTransaction(credentials);
  },

  get topupStash() {
    showDeprecationWarning('AfricasTalking().PAYMENTS.topupStash()', 'new Client().topupStash()', 'minor');
    return topupStash(credentials);
  },
  get walletTransfer() {
    showDeprecationWarning('AfricasTalking().PAYMENTS.walletTransfer()', 'new Client().walletTransfer()', 'minor');
    return walletTransfer(credentials);
  },

  // older
  get checkout() {
    showDeprecationWarning('AfricasTalking().PAYMENTS.checkout()', 'new Client().mobileCheckout()', 'minor');
    return mobileCheckout(credentials);
  },
  get checkOut() {
    showDeprecationWarning('AfricasTalking().PAYMENTS.checkOut()', 'new Client().mobileCheckout()', 'minor');
    return mobileCheckout(credentials);
  },
  get payConsumer() {
    showDeprecationWarning('AfricasTalking().PAYMENTS.payConsumer()', 'new Client().mobileB2C()', 'minor');
    return mobileB2C(credentials);
  },
  get payBusiness() {
    showDeprecationWarning('AfricasTalking().PAYMENTS.payBusiness()', 'new Client().mobileB2B()', 'minor');
    return mobileB2B(credentials);
  },

  ...CONSTANTS,
});

const SMS = (credentials: Credentials): Sms => ({
  get createSubscription() {
    showDeprecationWarning('AfricasTalking().SMS.createSubscription()', 'new Client().createSubscription()', 'minor');
    return createSubscription(credentials);
  },
  get deleteSubscription() {
    showDeprecationWarning('AfricasTalking().SMS.deleteSubscription()', 'new Client().deleteSubscription()', 'minor');
    return deleteSubscription(credentials);
  },
  get fetchSubscription() {
    showDeprecationWarning('AfricasTalking().SMS.fetchSubscription()', 'new Client().fetchSubscription()', 'minor');
    return fetchSubscription(credentials);
  },
  get fetchMessages() {
    showDeprecationWarning('AfricasTalking().SMS.fetchMessages()', 'new Client().fetchMessages()', 'minor');
    return fetchMessages(credentials);
  },
  get sendSms() {
    showDeprecationWarning('AfricasTalking().SMS.sendSms()', 'new Client().sendSms()', 'minor');
    return sendSms(credentials);
  },
  get sendPremiumSms() {
    showDeprecationWarning('AfricasTalking().SMS.sendPremiumSms()', 'new Client().sendPremiumSms()', 'minor');
    return sendPremiumSms(credentials);
  },

  // older
  get send() {
    showDeprecationWarning('AfricasTalking().SMS.send()', 'new Client().sendSms()', 'minor');
    return sendSms(credentials);
  },
  get sendPremium() {
    showDeprecationWarning('AfricasTalking().SMS.sendPremium()', 'new Client().sendPremiumSms()', 'minor');
    return sendPremiumSms(credentials);
  },
});

const TOKEN = (credentials: Credentials): Token => ({
  get createCheckoutToken() {
    showDeprecationWarning('AfricasTalking().TOKEN.createCheckoutToken()', 'new Client().createCheckoutToken()', 'minor');
    return createCheckoutToken(credentials);
  },
  get generateAuthToken() {
    showDeprecationWarning('AfricasTalking().TOKEN.generateAuthToken()', 'new Client().generateAuthToken()', 'minor');
    return generateAuthToken(credentials);
  },
});

const USSD: Ussd = expressHandler;

const VOICE = (credentials: Credentials): Voice => ({
  get ActionBuilder() {
    showDeprecationWarning('new AfricasTalking().VOICE.ActionBuilder()', 'new ActionBuilder()', 'minor');
    return ActionBuilder;
  },
  get makeCall() {
    showDeprecationWarning('AfricasTalking().VOICE.makeCall()', 'new Client().makeCall()', 'minor');
    return makeCall(credentials);
  },
  get getNumQueuedCalls() {
    showDeprecationWarning('AfricasTalking().VOICE.getNumQueuedCalls()', 'new Client().getNumQueuedCalls()', 'minor');
    return getNumQueuedCalls(credentials);
  },
  get uploadMediaFile() {
    showDeprecationWarning('AfricasTalking().VOICE.uploadMediaFile()', 'new Client().uploadMediaFile()', 'minor');
    return uploadMediaFile(credentials);
  },

  // older
  get call() {
    showDeprecationWarning('AfricasTalking().VOICE.call()', 'new Client().makeCall()', 'minor');
    return makeCall(credentials);
  },
});

export const AfricasTalking = (credentials: Credentials): AFRICASTALKING => {
  showDeprecationWarning('AfricasTalking()', 'new Client()', 'minor');

  return {
    get AIRTIME() {
      showDeprecationWarning('AfricasTalking().AIRTIME', 'new Client()', 'minor');
      return AIRTIME(credentials);
    },
    get APPLICATION() {
      showDeprecationWarning('AfricasTalking().APPLICATION', 'new Client()', 'minor');
      return APPLICATION(credentials);
    },
    get PAYMENTS() {
      showDeprecationWarning('AfricasTalking().PAYMENTS', 'new Client()', 'minor');
      return PAYMENTS(credentials);
    },
    get SMS() {
      showDeprecationWarning('AfricasTalking().SMS', 'new Client()', 'minor');
      return SMS(credentials);
    },
    get TOKEN() {
      showDeprecationWarning('AfricasTalking().TOKEN', 'new Client()', 'minor');
      return TOKEN(credentials);
    },
    get USSD() {
      showDeprecationWarning('AfricasTalking().USSD', undefined, 'minor');
      return USSD;
    },
    get VOICE() {
      showDeprecationWarning('AfricasTalking().VOICE', 'new Client()', 'minor');
      return VOICE(credentials);
    },

    get ACCOUNT() {
      showDeprecationWarning('AfricasTalking().ACCOUNT', 'new Client()', 'minor');
      return APPLICATION(credentials);
    },
    get PAYMENT() {
      showDeprecationWarning('AfricasTalking().PAYMENT', 'new Client()', 'minor');
      return PAYMENTS(credentials);
    },
  };
};
