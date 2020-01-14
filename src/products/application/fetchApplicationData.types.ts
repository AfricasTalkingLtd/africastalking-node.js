export interface ApplicationQueryParams {
  username: string;
}

export interface ApplicationResponse {
  UserData: {
    balance: string;
  };
}

export type FetchApplicationData = () => Promise<ApplicationResponse>;
