export interface BankCheckoutChargeOptions {
  productName: string;
  bankAccount: {
    accountName: string;
    accountNumber: string;
    bankCode: number;
    dateOfBirth?: string;
  };
  currencyCode: 'KES' | 'UGX' | 'USD';
  amount: number;
  narration: string;
  metadata?: {
    [key: string]: any;
  };
}

export interface BankCheckoutChargePostData extends BankCheckoutChargeOptions {
  username: string;
}

export interface BankCheckoutChargeResponse {
  status: 'PendingConfirmation' | 'InvalidRequest' | 'NotSupported' | 'Failed';
  description: string;
  transactionId?: string;
}

export type BankCheckoutCharge = (
  options: BankCheckoutChargeOptions
) => Promise<BankCheckoutChargeResponse>;
