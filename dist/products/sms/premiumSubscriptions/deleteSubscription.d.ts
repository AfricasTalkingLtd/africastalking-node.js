import { DeleteSubscriptionOptions, DeleteSubscriptionResponse } from './deleteSubscription.types';
import { Credentials } from '../../../utils/getFullCredentials.types';
export declare const deleteSubscription: (credentials: Credentials) => (options: DeleteSubscriptionOptions) => Promise<DeleteSubscriptionResponse>;
