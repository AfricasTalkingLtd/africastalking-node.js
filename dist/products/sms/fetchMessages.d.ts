import { FetchMessagesResponse, FetchMessagesOptions } from './fetchMessages.types';
import { Credentials } from '../../utils/getFullCredentials.types';
export declare const fetchMessages: (credentials: Credentials) => (options: FetchMessagesOptions) => Promise<FetchMessagesResponse>;
