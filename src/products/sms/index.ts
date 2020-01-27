import { Sms } from './index.types';
import { Credentials } from '../../utils/getFullCredentials.types';
import { createSubscription } from './premiumSubscriptions/createSubscription';
import { deleteSubscription } from './premiumSubscriptions/deleteSubscription';
import { fetchSubscription } from './premiumSubscriptions/fetchSubscription';
import { fetchMessages } from './fetchMessages';
import { sendSms, sendBulk, sendPremium } from './sendSms';
import { showDeprecationWarning } from '../../utils/misc';

// exports 1: types
export { CreateSubscriptionOptions, CreateSubscriptionResponse } from './premiumSubscriptions/createSubscription.types';
export { DeleteSubscriptionOptions, DeleteSubscriptionResponse } from './premiumSubscriptions/deleteSubscription.types';
export { FetchSubscriptionOptions, FetchSubscriptionResponse } from './premiumSubscriptions/fetchSubscription.types';
export { FetchMessagesOptions, FetchMessagesResponse } from './fetchMessages.types';
export { SmsOptions, SmsResponse } from './sendSms.types';

// exports 2: pure functions
export { createSubscription } from './premiumSubscriptions/createSubscription';
export { deleteSubscription } from './premiumSubscriptions/deleteSubscription';
export { fetchSubscription } from './premiumSubscriptions/fetchSubscription';
export { fetchMessages } from './fetchMessages';
export { sendSms, sendBulk, sendPremium } from './sendSms';

// exports 3: instance-based functions
export const SMS = (credentials: Credentials): Sms => ({
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
