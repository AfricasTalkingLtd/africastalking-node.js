export interface TopupStashOptions {
    productName: string;
    currencyCode: 'KES' | 'UGX' | 'USD';
    amount: number;
    metadata: {
        [key: string]: any;
    };
}
export declare type TopupStashPostData = TopupStashOptions & {
    username: string;
};
export interface TopupStashResponse {
    status: 'Success' | 'Failed';
    description: string;
    transactionId?: string;
}
