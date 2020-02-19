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
  get sendAirtimeRequest() {
    showDeprecationWarning('AfricasTalking().AIRTIME.send()', 'new Client().sendAirtimeRequest()', 'minor');
    return sendAirtimeRequest(credentials);
  },

  get send() {
    showDeprecationWarning('AfricasTalking().AIRTIME.send()', 'new Client().sendAirtimeRequest()', 'minor');
    return sendAirtimeRequest(credentials);
  },
});

const APPLICATION = (credentials: Credentials): Application => ({
  get fetchApplicationData() {
    showDeprecationWarning('AfricasTalking().APPLICATION.fetchAccount()', 'new Client().fetchApplicationData()', 'minor');
    return fetchApplicationData(credentials);
  },

  get fetchAccount() {
    showDeprecationWarning('AfricasTalking().APPLICATION.fetchAccount()', 'new Client().fetchApplicationData()', 'minor');
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
  get createSubscription() {
    showDeprecationWarning('AfricasTalking().SMS.send()', 'new Client().sendSms()', 'minor');
    return createSubscription(credentials);
  },
  get deleteSubscription() {
    showDeprecationWarning('AfricasTalking().SMS.send()', 'new Client().sendSms()', 'minor');
    return deleteSubscription(credentials);
  },
  get fetchSubscription() {
    showDeprecationWarning('AfricasTalking().SMS.send()', 'new Client().sendSms()', 'minor');
    return fetchSubscription(credentials);
  },
  get fetchMessages() {
    showDeprecationWarning('AfricasTalking().SMS.send()', 'new Client().sendSms()', 'minor');
    return fetchMessages(credentials);
  },
  get sendSms() {
    showDeprecationWarning('AfricasTalking().SMS.sendSms()', 'new Client().sendSms()', 'minor');
    return sendSms(credentials);
  },
  get sendBulk() {
    showDeprecationWarning('AfricasTalking().SMS.send()', 'new Client().sendSms()', 'minor');
    return sendBulk(credentials);
  },
  get sendPremium() {
    showDeprecationWarning('AfricasTalking().SMS.send()', 'new Client().sendSms()', 'minor');
    return sendPremium(credentials);
  },

  // older
  get send() {
    showDeprecationWarning('AfricasTalking().SMS.send()', 'new Client().sendSms()', 'minor');
    return sendSms(credentials);
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
    showDeprecationWarning('AfricasTalking().VOICE.call()', 'new Client().makeCall()', 'minor');
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
      showDeprecationWarning('AfricasTalking().USSD', 'expressHandler()', 'minor');
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
