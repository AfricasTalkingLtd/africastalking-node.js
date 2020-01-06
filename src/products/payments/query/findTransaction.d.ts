import { TransactionResponse } from './misc.d';

export interface FindTransactionOptions {
  transactionId: string;
}

export type FindTransactionQueryParams = FindTransactionOptions & {
  username: string;
};

export interface FindTransactionResponse {
  status: 'Success' | 'Failed';
  data: TransactionResponse;
  errorMessage?: string;
}
