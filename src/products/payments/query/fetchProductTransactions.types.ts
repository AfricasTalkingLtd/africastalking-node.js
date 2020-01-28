import {
  TransactionResponse, Category, Provider, PartyType,
} from './misc.types';

export interface FetchProductTransactionsOptions {
  productName: string;
  filters: {
    pageNumber: string;
    count: string;
    startDate?: string;
    endDate?: string;
    category?: Category;
    provider?: Provider;
    status?: 'Sucess' | 'Failed';
    source?: PartyType;
    destination?: PartyType;
    providerChannel?: string;
  };
}

export interface FetchProductTransactionsQueryParams {
  username: string;
  productName: string;
  pageNumber: string;
  count: string;
  startDate?: string;
  endDate?: string;
  category?: Category;
  provider?: Provider;
  status?: 'Sucess' | 'Failed';
  source?: PartyType;
  destination?: PartyType;
  providerChannel?: string;
}

export interface FetchProductTransactionsResponse {
  status: 'Success' | 'Failed';
  responses: TransactionResponse[];
}

export type FetchProductTransactions = (
  options: FetchProductTransactionsOptions
) => Promise<FetchProductTransactionsResponse>;
