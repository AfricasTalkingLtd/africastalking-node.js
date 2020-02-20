export interface SendSmsOptions {
  to: string | string[];
  message: string;
  from?: string;
  enqueue?: boolean;
}

export interface SendPremiumSmsOptions extends SendSmsOptions {
  bulkSMSMode?: boolean;
  keyword?: string;
  linkId?: string;
  retryDurationInHours?: number;
}

export type SendMessageOptions = SendPremiumSmsOptions;

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
  options: SendMessageOptions, isPremium?: boolean
) => Promise<SendMessageResponse>;

export type SendSms = (options: SendSmsOptions) => Promise<SendMessageResponse>;
export type SendPremiumSms = (options: SendPremiumSmsOptions) => Promise<SendMessageResponse>;
