import { fetchMessages } from './fetchMessages';
import { FullCredentials } from '../index.interface';
import { SmsOptions } from './sendSms.interface';
import { sendSms } from './sendSms';
import { fetchSubscription } from './fetchSubscription';
import { createSubscription } from './createSubscription';
import { deleteSubscription } from './deleteSubscription';

export const SMS = (fullCredentials: FullCredentials) => ({
  send: sendSms(fullCredentials),
  sendBulk: (options: SmsOptions) => sendSms(fullCredentials)(options, true),
  sendPremium: (options: SmsOptions) => sendSms(fullCredentials)(options, false, true),
  fetchMessages: fetchMessages(fullCredentials),
  fetchSubscription: fetchSubscription(fullCredentials),
  createSubscription: createSubscription(fullCredentials),
  deleteSubscription: deleteSubscription(fullCredentials),
});
