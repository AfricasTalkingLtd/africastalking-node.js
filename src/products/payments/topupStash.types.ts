export interface TopupStashOptions {
  productName: string;
  currencyCode: 'KES' | 'UGX' | 'USD';
  amount: number;
  metadata?: {
    [key: string]: any;
  };
}

export interface TopupStashPostData extends TopupStashOptions {
  username: string;
}

export interface TopupStashResponse {
  status: 'Success' | 'Failed';
  description: string;
  transactionId?: string;
}

export type TopupStash = (options: TopupStashOptions) => Promise<TopupStashResponse>;
