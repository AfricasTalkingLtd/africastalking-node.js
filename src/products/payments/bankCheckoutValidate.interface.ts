export interface BankCheckoutValidateOptions {
  transactionId: string;
  otp: string;
}

export type BankCheckoutValidatePostData = BankCheckoutValidateOptions & {
  username: string;
};

export interface BankCheckoutValidateResponse {
  status: 'Success' | 'Failed';
  description: string;
}
