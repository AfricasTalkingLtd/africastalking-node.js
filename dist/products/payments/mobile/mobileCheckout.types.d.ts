export interface MobileCheckoutOptions {
    productName: string;
    providerChannel?: string;
    phoneNumber: string;
    currencyCode: 'KES' | 'UGX' | 'USD';
    amount: number;
    metadata: {
        [key: string]: any;
    };
}
export declare type MobileCheckoutPostData = MobileCheckoutOptions & {
    username: string;
};
export interface MobileCheckoutResponse {
    status: 'PendingConfirmation' | 'InvalidRequest' | 'NotSupported' | 'Failed';
    description: string;
    transactionId?: string;
    providerChannel?: string;
}
