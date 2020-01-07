import { Credentials } from '../../../utils/getFullCredentials.types';
import { FetchWalletTransactionsOptions, FetchWalletTransactionsResponse } from './fetchWalletTransactions.types';
export declare const fetchWalletTransactions: (credentials: Credentials) => (options: FetchWalletTransactionsOptions) => Promise<FetchWalletTransactionsResponse>;
