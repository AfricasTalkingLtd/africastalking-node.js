export interface FetchMessagesOptions {
  lastReceivedId?: string;
}

export interface FetchMessagesQueryParams extends FetchMessagesOptions {
  username: string;
}

export interface FetchMessagesResponse {
  SMSMessageData: {
    Messages: {
      linkId: string;
      text: string;
      to: string;
      id: number;
      date: string;
      from: string;
    }[];
  };
}

export type FetchMessages = (options?: FetchMessagesOptions) => Promise<FetchMessagesResponse>;
