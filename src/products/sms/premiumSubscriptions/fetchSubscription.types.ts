export interface FetchSubscriptionOptions {
  shortCode: string;
  keyword: string;
  lastReceivedId?: number;
}

export interface FetchSubscriptionQueryParams extends FetchSubscriptionOptions {
  username: string;
}

export interface FetchSubscriptionResponse {
  Subscriptions: {
    id: number;
    phoneNumber: string;
    date: string;
  }[];
}

export type FetchSubscription = (
  options: FetchSubscriptionOptions
) => Promise<FetchSubscriptionResponse>;
