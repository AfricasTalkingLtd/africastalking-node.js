export interface MobileCheckoutOptions {
  productName: string;
  providerChannel?: string;
  phoneNumber: string;
  currencyCode: 'KES' | 'UGX' | 'USD';
  amount: number;
  metadata: {
    [key: string]: any;
  };
}

export interface MobileCheckoutPostData extends MobileCheckoutOptions {
  username: string;
}

export interface MobileCheckoutResponse {
  status: 'PendingConfirmation' | 'InvalidRequest' | 'NotSupported' | 'Failed';
  description: string;
  transactionId?: string;
  providerChannel?: string;
}

export type MobileCheckout = (options: MobileCheckoutOptions) => Promise<MobileCheckoutResponse>;
