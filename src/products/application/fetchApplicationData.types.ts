export interface FetchApplicationDataQueryParams {
  username: string;
}

export interface FetchApplicationDataResponse {
  UserData: {
    balance: string;
  };
}

export type FetchApplicationData = () => Promise<FetchApplicationDataResponse>;
