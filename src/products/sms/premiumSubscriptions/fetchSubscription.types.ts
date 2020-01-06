export interface FetchSubscriptionOptions {
  shortCode: string;
  keyword: string;
  lastReceivedId?: number;
}

export type FetchSubscriptionQueryParams = FetchSubscriptionOptions & {
  username: string;
};

export interface FetchSubscriptionResponse {
  Subscriptions: {
    id: number;
    phoneNumber: string;
    date: string;
  }[];
}
