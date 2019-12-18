import { TransactionResponse } from './misc.interface';

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
