export interface GenerateAuthTokenResponse {
    token: string;
    lifetimeInSeconds: number;
    description?: string;
}
