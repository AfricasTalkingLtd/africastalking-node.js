export interface GenerateAuthTokenPostData {
  username: string;
}

export interface GenerateAuthTokenResponse {
  token: string;
  lifetimeInSeconds: number;
  description?: string;
}

export type GenerateAuthToken = () => Promise<GenerateAuthTokenResponse>;
