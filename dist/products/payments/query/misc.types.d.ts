interface Metadata {
    [key: string]: any;
}
export declare type PartyType = 'phoneNumber' | 'BankAccount' | 'Card' | 'Wallet';
export declare type Provider = 'Mpesa' | 'Segovia' | 'Flutterwave' | 'Admin' | 'Athena';
export declare type Category = 'BankCheckout' | 'CardCheckout' | 'MobileCheckout' | 'MobileC2B' | 'MobileB2C' | 'MobileB2B' | 'BankTransfer' | 'WalletTransfer' | 'UserStashTopup';
export interface TransactionResponse {
    requestMetadata: Metadata;
    sourceType: PartyType;
    source: string;
    provider: Provider;
    destinationType: PartyType;
    description: string;
    providerChannel: string;
    transactionFee?: string;
    providerRefId: string;
    providerMetadata: Metadata;
    status: 'Success' | 'Failed';
    productName: string;
    category: Category;
    transactionDate: string;
    destination: string;
    value: string;
    transactionId: string;
    creationTime: string;
}
export {};
