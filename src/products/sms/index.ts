import { Sms } from './index.types';
import { Credentials } from '../../utils/getFullCredentials.types';
import { createSubscription } from './premiumSubscriptions/createSubscription';
import { deleteSubscription } from './premiumSubscriptions/deleteSubscription';
import { fetchSubscription } from './premiumSubscriptions/fetchSubscription';
import { fetchMessages } from './fetchMessages';
import { sendSms } from './sendSms';

export const sms = (credentials: Credentials): Sms => ({
  createSubscription: createSubscription(credentials),
  deleteSubscription: deleteSubscription(credentials),
  fetchSubscription: fetchSubscription(credentials),
  fetchMessages: fetchMessages(credentials),
  send: (opts) => sendSms(credentials)(opts),
  sendBulk: (opts) => sendSms(credentials)(opts, true),
  sendPremium: (opts) => sendSms(credentials)(opts, false, true),
});
