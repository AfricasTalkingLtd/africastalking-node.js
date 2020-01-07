import { Credentials } from '../../../utils/getFullCredentials.types';
import { BankTransferOptions, BankTransferResponse } from './bankTransfer.types';
export declare const bankTransfer: (credentials: Credentials) => (options: BankTransferOptions) => Promise<BankTransferResponse>;
