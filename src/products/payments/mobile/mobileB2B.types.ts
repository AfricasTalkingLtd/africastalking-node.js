export interface MobileB2BOptions {
  productName: string;
  provider: 'Mpesa' | 'TigoTanzania' | 'Athena';
  transferType: 'BusinessBuyGoods' | 'BusinessPayBill' | 'DisburseFundsToBusiness' | 'BusinessToBusinessTransfer';
  currencyCode: 'KES' | 'UGX' | 'USD';
  amount: number;
  destinationChannel: string;
  destinationAccount: string;
  metadata: {
    [key: string]: any;
  };
}

export interface MobileB2BPostData extends MobileB2BOptions {
  username: string;
}

export interface MobileB2BResponse {
  status: 'Queued' | 'InvalidRequest' | 'NotSupported' | 'Failed';
  transaction?: string;
  transactionFee?: string;
  providerChannel: string;
  errorMessage: string;
}

export type MobileB2B = (options: MobileB2BOptions) => Promise<MobileB2BResponse>;
