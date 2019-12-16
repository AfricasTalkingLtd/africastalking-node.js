export interface CreateSubscriptionOptions {
  shortCode: string;
  keyword: string;
  phoneNumber: string;
  checkoutToken: string;
}

export type CreateSubscriptionPostData = CreateSubscriptionOptions & {
  username: string;
};

export interface CreateSubscriptionResponse {
  status: 'Success' | 'Failed';
  description: string;
}
