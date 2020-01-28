export interface DeleteSubscriptionOptions {
  shortCode: string;
  keyword: string;
  phoneNumber: string;
}

export interface DeleteSubscriptionPostData extends DeleteSubscriptionOptions {
  username: string;
}

export interface DeleteSubscriptionResponse {
  status: 'Success' | 'Failed';
  description: string;
}

export type DeleteSubscription = (
  options: DeleteSubscriptionOptions
) => Promise<DeleteSubscriptionResponse>;
