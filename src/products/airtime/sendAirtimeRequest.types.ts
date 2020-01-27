export interface SendAirtimeOptions {
  recipients: {
    phoneNumber: string;
    currencyCode: 'KES' | 'UGX' | 'TZS' | 'NGN';
    amount: number;
  }[];
}

export interface SendAirtimePostData {
  username: string;
  recipients: {
    phoneNumber: string;
    amount: String;
  }[];
}

export interface SendAirtimeResponse {
  numSent: number;
  totalAmount: string;
  totalDiscount: string;
  responses: {
    phoneNumber: string;
    amount: string;
    discount: string;
    status: 'Sent' | 'Failed';
    requestId: string;
    errorMessage: 'None' | string;
  }[];
  errorMessage?: 'None' | string;
}

export type SendAirtimeRequest = (
  options: SendAirtimeOptions
) => Promise<SendAirtimeResponse>;
