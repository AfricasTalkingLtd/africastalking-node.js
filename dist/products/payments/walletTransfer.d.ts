import { Credentials } from '../../utils/getFullCredentials.types';
import { WalletTransferOptions, WalletTransferResponse } from './walletTransfer.types';
export declare const walletTransfer: (credentials: Credentials) => (options: WalletTransferOptions) => Promise<WalletTransferResponse>;
