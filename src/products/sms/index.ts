import { fetchMessages } from './fetchMessages';
import { SmsOptions } from './sendSms.d';
import { sendSms } from './sendSms';
import { fetchSubscription } from './premiumSubscriptions/fetchSubscription';
import { createSubscription } from './premiumSubscriptions/createSubscription';
import { deleteSubscription } from './premiumSubscriptions/deleteSubscription';
import { Credentials } from '../../utils/getFullCredentials.d';

export const SMS = (credentials: Credentials) => ({
  send: (options: SmsOptions) => sendSms(credentials)(options),
  sendBulk: (options: SmsOptions) => sendSms(credentials)(options, true),
  sendPremium: (options: SmsOptions) => sendSms(credentials)(options, false, true),
  fetchMessages: fetchMessages(credentials),
  fetchSubscription: fetchSubscription(credentials),
  createSubscription: createSubscription(credentials),
  deleteSubscription: deleteSubscription(credentials),
});
