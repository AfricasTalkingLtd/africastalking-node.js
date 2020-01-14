export interface MobileB2COptions {
  productName: string;
  recipients: {
    name?: string;
    phoneNumber: string;
    currencyCode: 'KES' | 'UGX' | 'USD';
    amount: number;
    providerChannel?: string;
    reason?: 'SalaryPayment' | 'SalaryPaymentWithWithdrawalChargePaid'
    | 'BusinessPayment' | 'BusinessPaymentWithWithdrawalChargePaid' | 'PromotionPayment';
    metadata: {
      [key: string]: any;
    };
  }[];
}

export interface MobileB2CPostData extends MobileB2COptions {
  username: string;
}

export interface MobileB2CResponse {
  numQueued: number;
  totalValue?: string;
  totalTransactionFee: string;
  entries: {
    phoneNumber: string;
    status: 'Queued' | 'InvalidRequest' | 'NotSupported' | 'Failed';
    transactionId?: string;
    provider?: 'Mpesa' | 'Segovia' | 'Athena';
    providerChannel?: string;
    value: string;
    transactionFee?: string;
    errorMessage?: string;
  }[];
  errorMessage?: string;
}

export type MobileB2C = (options: MobileB2COptions) => Promise<MobileB2CResponse>;
