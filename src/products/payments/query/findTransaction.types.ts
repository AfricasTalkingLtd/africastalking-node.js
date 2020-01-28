import { TransactionResponse } from './misc.types';

export interface FindTransactionOptions {
  transactionId: string;
}

export interface FindTransactionQueryParams extends FindTransactionOptions {
  username: string;
}

export interface FindTransactionResponse {
  status: 'Success' | 'Failed';
  data: TransactionResponse;
  errorMessage?: string;
}

export type FindTransaction = (options: FindTransactionOptions) => Promise<FindTransactionResponse>;
