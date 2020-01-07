import { Credentials } from '../../../utils/getFullCredentials.types';
import { FindTransactionOptions, FindTransactionResponse } from './findTransaction.types';
export declare const findTransaction: (credentials: Credentials) => (options: FindTransactionOptions) => Promise<FindTransactionResponse>;
