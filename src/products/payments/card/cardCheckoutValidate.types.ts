export interface CardCheckoutValidateOptions {
  transactionId: string;
  otp: string;
}

export interface CardCheckoutValidatePostData extends CardCheckoutValidateOptions {
  username: string;
}

export interface CardCheckoutValidateResponse {
  status: 'Success' | 'Failed';
  description: string;
  checkoutToken?: string;
}

export type CardCheckoutValidate = (
  options: CardCheckoutValidateOptions
) => Promise<CardCheckoutValidateResponse>;
