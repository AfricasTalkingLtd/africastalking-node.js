import { FetchSubscriptionOptions, FetchSubscriptionResponse } from './fetchSubscription.types';
import { Credentials } from '../../../utils/getFullCredentials.types';
export declare const fetchSubscription: (credentials: Credentials) => (options: FetchSubscriptionOptions) => Promise<FetchSubscriptionResponse>;
