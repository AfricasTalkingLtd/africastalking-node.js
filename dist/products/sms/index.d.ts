import { SmsOptions } from './sendSms.types';
import { Credentials } from '../../utils/getFullCredentials.types';
export declare const SMS: (credentials: Credentials) => {
    send: (options: SmsOptions) => Promise<import("./sendSms.types").SmsResponse>;
    sendBulk: (options: SmsOptions) => Promise<import("./sendSms.types").SmsResponse>;
    sendPremium: (options: SmsOptions) => Promise<import("./sendSms.types").SmsResponse>;
    fetchMessages: (options: import("./fetchMessages.types").FetchMessagesOptions) => Promise<import("./fetchMessages.types").FetchMessagesResponse>;
    fetchSubscription: (options: import("./premiumSubscriptions/fetchSubscription.types").FetchSubscriptionOptions) => Promise<import("./premiumSubscriptions/fetchSubscription.types").FetchSubscriptionResponse>;
    createSubscription: (options: import("./premiumSubscriptions/createSubscription.types").CreateSubscriptionOptions) => Promise<import("./premiumSubscriptions/createSubscription.types").CreateSubscriptionResponse>;
    deleteSubscription: (options: import("./premiumSubscriptions/deleteSubscription.types").DeleteSubscriptionOptions) => Promise<import("./premiumSubscriptions/deleteSubscription.types").DeleteSubscriptionResponse>;
};
