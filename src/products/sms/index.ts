import { FetchMessagesOptions } from './fetchMessages.interface';
import { fetchMessages } from './fetchMessages';
import { FullCredentials } from '../index.interface';
import { SmsOptions } from './sendSms.interface';
import { sendSms } from './sendSms';
import { FetchSubscriptionOptions } from './fetchSubscription.interface';
import { fetchSubscription } from './fetchSubscription';
import { CreateSubscriptionOptions } from './createSubscription.interface';
import { createSubscription } from './createSubscription';
import { DeleteSubscriptionOptions } from './deleteSubscription.interface';
import { deleteSubscription } from './deleteSubscription';

export const SMS = (fullCredentials: FullCredentials) => ({
  send: (options: SmsOptions) => sendSms(fullCredentials, options),
  sendBulk: (options: SmsOptions) => sendSms(fullCredentials, options, true),
  sendPremium: (options: SmsOptions) => sendSms(fullCredentials, options, false, true),
  fetchMessages: (options: FetchMessagesOptions) => fetchMessages(fullCredentials, options),
  fetchSubscription: (options: FetchSubscriptionOptions) => fetchSubscription(
    fullCredentials, options,
  ),
  createSubscription: (options: CreateSubscriptionOptions) => createSubscription(
    fullCredentials, options,
  ),
  deleteSubscription: (options: DeleteSubscriptionOptions) => deleteSubscription(
    fullCredentials, options,
  ),
});
