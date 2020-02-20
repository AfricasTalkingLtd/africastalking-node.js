export interface SendSmsOptions {
  to: string | string[];
  message: string;
  from?: string;
  enqueue?: boolean;
}

export interface SendBulkSmsOptions extends SendSmsOptions {
  bulkSMSMode: true;
}

export interface SendPremiumSmsOptions extends SendSmsOptions {
  keyword?: string;
  linkId?: string;
  retryDurationInHours?: number;
}

export interface SendMessageOptions extends Omit<SendBulkSmsOptions & SendPremiumSmsOptions, 'bulkSMSMode'> {
  bulkSMSMode?: true;
}

export interface SendMessagePostData extends Omit<SendMessageOptions, 'enqueue' | 'bulkSMSMode'> {
  username: string;
  enqueue?: 0 | 1;
  bulkSMSMode?: 0 | 1;
}

export interface SendMessageResponse {
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

export type SendMessage = (
  options: SendMessageOptions, isBulk?: boolean, isPremium?: boolean,
) => Promise<SendMessageResponse>;


export type SendSms = (options: SendSmsOptions) => Promise<SendMessageResponse>;
export type SendBulkSms = (options: SendBulkSmsOptions) => Promise<SendMessageResponse>;
export type SendPremiumSms = (options: SendPremiumSmsOptions) => Promise<SendMessageResponse>;
