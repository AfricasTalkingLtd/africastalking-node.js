export interface WalletTransferOptions {
  productName: string;
  targetProductCode: number;
  currencyCode: 'KES' | 'UGX' | 'USD';
  amount: number;
  metadata?: {
    [key: string]: any;
  };
}

export interface WalletTransferPostData extends WalletTransferOptions {
  username: string;
}

export interface WalletTransferResponse {
  status: 'Success' | 'Failed';
  description: string;
  transactionId?: string;
}

export type WalletTransfer = (options: WalletTransferOptions) => Promise<WalletTransferResponse>;
