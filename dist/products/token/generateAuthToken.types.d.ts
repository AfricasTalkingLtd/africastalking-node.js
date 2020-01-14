export interface GenerateAuthTokenPostData {
    username: string;
}
export interface GenerateAuthTokenResponse {
    token: string;
    lifetimeInSeconds: number;
    description?: string;
}
export declare type GenerateAuthToken = () => Promise<GenerateAuthTokenResponse>;
