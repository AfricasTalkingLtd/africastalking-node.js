import { TransactionResponse, Category, Provider, PartyType } from './misc.types';
export interface FetchProductTransactionsOptions {
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
export declare type FetchProductTransactionsQueryParams = FetchProductTransactionsOptions & {
    username: string;
};
export interface FetchProductTransactionsResponse {
    status: 'Success' | 'Failed';
    responses: TransactionResponse[];
}
