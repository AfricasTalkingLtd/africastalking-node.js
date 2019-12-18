import { fetchMessages } from './fetchMessages';
import { SmsOptions } from './sendSms.interface';
import { sendSms } from './sendSms';
import { fetchSubscription } from './fetchSubscription';
import { createSubscription } from './createSubscription';
import { deleteSubscription } from './deleteSubscription';
import { Credentials } from '../../utils/getCredentials.interface';

export const SMS = (credentials: Credentials) => ({
  send: (options: SmsOptions) => sendSms(credentials)(options),
  sendBulk: (options: SmsOptions) => sendSms(credentials)(options, true),
  sendPremium: (options: SmsOptions) => sendSms(credentials)(options, false, true),
  fetchMessages: fetchMessages(credentials),
  fetchSubscription: fetchSubscription(credentials),
  createSubscription: createSubscription(credentials),
  deleteSubscription: deleteSubscription(credentials),
});
