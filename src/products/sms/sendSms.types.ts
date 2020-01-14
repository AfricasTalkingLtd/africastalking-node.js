export interface SmsOptions {
  to: string | string[];
  message: string;
  from?: string;
  enqueue?: boolean;

  bulkSMSMode?: boolean;

  keyword?: string;
  linkId?: string;
  retryDurationInHours?: number;
}

export interface SmsPostData extends Omit<SmsOptions, 'enqueue' | 'bulkSMSMode'> {
  username: string;
  enqueue?: 0 | 1;
  bulkSMSMode?: 0 | 1;
}

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

export type SendSms = (
  options: SmsOptions, isBulk?: boolean, isPremium?: boolean,
) => Promise<SmsResponse>;
