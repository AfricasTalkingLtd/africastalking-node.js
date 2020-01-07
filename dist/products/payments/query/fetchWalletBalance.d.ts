import { Credentials } from '../../../utils/getFullCredentials.types';
import { FetchWalletBalanceResponse } from './fetchWalletBalance.types';
export declare const fetchWalletBalance: (credentials: Credentials) => () => Promise<FetchWalletBalanceResponse>;
