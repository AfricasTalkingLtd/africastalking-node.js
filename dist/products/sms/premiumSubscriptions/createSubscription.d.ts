import { CreateSubscriptionOptions, CreateSubscriptionResponse } from './createSubscription.types';
import { Credentials } from '../../../utils/getFullCredentials.types';
export declare const createSubscription: (credentials: Credentials) => (options: CreateSubscriptionOptions) => Promise<CreateSubscriptionResponse>;
