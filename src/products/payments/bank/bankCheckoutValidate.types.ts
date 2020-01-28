export interface BankCheckoutValidateOptions {
  transactionId: string;
  otp: string;
}

export interface BankCheckoutValidatePostData extends BankCheckoutValidateOptions {
  username: string;
}

export interface BankCheckoutValidateResponse {
  status: 'Success' | 'Failed';
  description: string;
}

export type BankCheckoutValidate = (
  options: BankCheckoutValidateOptions
) => Promise<BankCheckoutValidateResponse>;
