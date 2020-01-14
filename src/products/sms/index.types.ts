import { CreateSubscription } from './premiumSubscriptions/createSubscription.types';
import { DeleteSubscription } from './premiumSubscriptions/deleteSubscription.types';
import { FetchSubscription } from './premiumSubscriptions/fetchSubscription.types';
import { FetchMessages } from './fetchMessages.types';
import { SmsOptions, SmsResponse } from './sendSms.types';

export interface Sms {
  createSubscription: CreateSubscription;
  deleteSubscription: DeleteSubscription;
  fetchSubscription: FetchSubscription;
  fetchMessages: FetchMessages;
  send: (options: SmsOptions) => Promise<SmsResponse>;
  sendBulk: (options: SmsOptions) => Promise<SmsResponse>;
  sendPremium: (options: SmsOptions) => Promise<SmsResponse>;
}
