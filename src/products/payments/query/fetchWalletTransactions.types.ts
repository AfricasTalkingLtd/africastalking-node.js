import { Category, TransactionResponse } from './misc.types';

export interface FetchWalletTransactionsOptions {
  filters: {
    pageNumber: string;
    count: string;
    startDate?: string;
    endDate?: string;
    categories?: string;
  };

}

export interface FetchWalletTransactionsQueryParams {
  username: string;
  pageNumber: string;
  count: string;
  startDate?: string;
  endDate?: string;
  categories?: string;
}

export interface FetchWalletTransactionsResponse {
  status: 'Success' | 'Failed';
  responses: {
    description: string;
    balance: string;
    category: Category;
    transactionData: TransactionResponse;
    value: string;
    transactionId: string;
  }[];
  errorMessage?: string;
}

export type FetchWalletTransactions = (
  options: FetchWalletTransactionsOptions
) => Promise<FetchWalletTransactionsResponse>;
