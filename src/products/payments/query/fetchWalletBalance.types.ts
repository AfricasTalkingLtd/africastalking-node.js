export interface FetchWalletBalanceQueryParams {
  username: string;
}

export interface FetchWalletBalanceResponse {
  status: 'Success' | 'Failed';
  balance: string;
  errorMessage?: string;
}

export type FetchWalletBalance = () => Promise<FetchWalletBalanceResponse>;
