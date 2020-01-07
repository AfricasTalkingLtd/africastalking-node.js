export interface CreateCheckoutTokenOptions {
    phoneNumber: string;
}
export declare type CreateCheckoutTokenPostData = CreateCheckoutTokenOptions;
export interface CreateCheckoutTokenResponse {
    description: string;
    token: string;
}
