import { Credentials } from '../../utils/getFullCredentials.types';
import { GetNumQueuedCallsOptions, GetNumQueuedCallsResponse } from './getNumQueuedCalls.types';
export declare const getNumQueuedCalls: (credentials: Credentials) => (options: GetNumQueuedCallsOptions) => Promise<GetNumQueuedCallsResponse>;
