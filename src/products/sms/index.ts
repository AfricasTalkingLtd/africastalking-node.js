import { FetchMessagesOptions } from './fetchMessages.interface';
import { fetchMessages } from './fetchMessages';
import { FullCredentials } from '../index.interface';
import { SmsOptions } from './sendSms.interface';
import { sendSms } from './sendSms';

export const SMS = (fullCredentials: FullCredentials) => ({
  send: (options: SmsOptions) => sendSms(fullCredentials, options),
  sendBulk: (options: SmsOptions) => sendSms(fullCredentials, options, true),
  sendPremium: (options: SmsOptions) => sendSms(fullCredentials, options, false, true),
  fetchMessages: (options: FetchMessagesOptions) => fetchMessages(fullCredentials, options),
});

// export const fetchSubscription = () => {

// };

// export const createSubscription = () => {

// };

// export const deleteSubscription = () => {

// };
