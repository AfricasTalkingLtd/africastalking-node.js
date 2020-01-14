export interface GetNumQueuedCallsOptions {
  phoneNumbers: string;
}

export interface GetNumQueuedCallsPostData extends GetNumQueuedCallsOptions {
  username: string;
}

export interface GetNumQueuedCallsResponse {
  status: string;
  entries: {
    phoneNumber: string;
    queueName: string;
    numCalls: number;
  }[];
  errorMessage: 'None' | string;
}

export type GetNumQueuedCalls = (
  options: GetNumQueuedCallsOptions
) => Promise<GetNumQueuedCallsResponse>;
