export interface CardCheckoutChargeOptions {
  productName: string;
  paymentCard?: {
    number: string;
    cvvNumber: number;
    expiryMonth: number;
    expiryYear: number;
    countryCode: 'NG';
    authToken: string;
  };
  checkoutToken?: string;
  currencyCode: 'KES' | 'UGX' | 'USD';
  amount: number;
  narration: string;
  metadata: {
    [key: string]: any;
  };
}

export type CardCheckoutChargePostData = CardCheckoutChargeOptions & {
  username: string;
};

export interface CardCheckoutChargeResponse {
  status: 'PendingConfirmation' | 'Success' | 'InvalidRequest' | 'NotSupported' | 'Failed';
  description: string;
  transactionId?: string;
}
