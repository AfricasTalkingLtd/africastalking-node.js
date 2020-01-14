export interface CreateSubscriptionOptions {
  shortCode: string;
  keyword: string;
  phoneNumber: string;
  checkoutToken: string;
}

export interface CreateSubscriptionPostData extends CreateSubscriptionOptions {
  username: string;
}

export interface CreateSubscriptionResponse {
  status: 'Success' | 'Failed';
  description: string;
}

export type CreateSubscription = (
  options: CreateSubscriptionOptions
) => Promise<CreateSubscriptionResponse>;
