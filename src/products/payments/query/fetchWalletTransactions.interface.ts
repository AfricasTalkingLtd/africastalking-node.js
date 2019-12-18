import { Category, TransactionResponse } from './misc.interface';

export interface FetchWalletTransactionsOptions {
  pageNumber: string;
  count: string;
  startDate?: string;
  endDate?: string;
  categories?: string;
}

export type FetchWalletTransactionsQueryParams = FetchWalletTransactionsOptions & {
  username: string;
};

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
