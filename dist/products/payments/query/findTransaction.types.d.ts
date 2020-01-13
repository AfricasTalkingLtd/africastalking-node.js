import { TransactionResponse } from './misc.types';
export interface FindTransactionOptions {
    transactionId: string;
}
export declare type FindTransactionQueryParams = FindTransactionOptions & {
    username: string;
};
export interface FindTransactionResponse {
    status: 'Success' | 'Failed';
    data: TransactionResponse;
    errorMessage?: string;
}