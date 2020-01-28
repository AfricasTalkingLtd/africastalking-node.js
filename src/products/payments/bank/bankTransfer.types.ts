export interface BankTransferOptions {
  productName: string;
  recipients: {
    bankAccount: {
      accountName?: string;
      accountNumber: string;
      bankCode: number;
      dateOfBirth?: string;
    };
    currencyCode: 'KES' | 'UGX' | 'USD';
    amount: number;
    narration: string;
    metadata: {
      [key: string]: any;
    };
  }[];
}

export interface BankTransferPostData extends BankTransferOptions {
  username: string;
}

export interface BankTransferResponse {
  entries: {
    accountNumber: string;
    status: 'Invalid Request' | 'Not Supported' | 'Failed';
    transactionId?: string;
    transactionFee?: string;
    errorMessage?: string;
  }[];
  errorMessage?: string;
}

export type BankTransfer = (options: BankTransferOptions) => Promise<BankTransferResponse>;
