export interface CardCheckoutValidateOptions {
  transactionId: string;
  otp: string;
}

export type CardCheckoutValidatePostData = CardCheckoutValidateOptions & {
  username: string;
};

export interface CardCheckoutValidateResponse {
  status: 'Success' | 'Failed';
  description: string;
  checkoutToken?: string;
}
