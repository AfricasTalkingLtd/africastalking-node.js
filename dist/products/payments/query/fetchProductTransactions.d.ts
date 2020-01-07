import { Credentials } from '../../../utils/getFullCredentials.types';
import { FetchProductTransactionsOptions, FetchProductTransactionsResponse } from './fetchProductTransactions.types';
export declare const fetchProductTransactions: (credentials: Credentials) => (options: FetchProductTransactionsOptions) => Promise<FetchProductTransactionsResponse>;
