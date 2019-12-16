export interface SmsOptions {
  to: string | string[];
  message: string;
  from: string;

  bulkSMSMode?: 0 | 1;
  enqueue?: 0 | 1;

  keyword?: string;
  linkId?: string;
  retryDurationInHours?: number;
}

export type SmsPostData = SmsOptions & {
  username: string;
};

export interface SmsResponse {
  SMSMessageData: {
    Message: string;
    Recipients: {
      statusCode: 100 | 101 | 102 | 401 | 402 | 403 | 404 | 404 | 405 | 406 | 407 | 500 | 501 | 502;
      number: string;
      cost: string;
      status: string;
      messageId: string;
    }[];
  };
}
