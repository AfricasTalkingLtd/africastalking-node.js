export interface CreateCheckoutTokenOptions {
  phoneNumber: string;
}

export type CreateCheckoutTokenPostData = CreateCheckoutTokenOptions;

export interface CreateCheckoutTokenResponse {
  description: string;
  token: string;
}
