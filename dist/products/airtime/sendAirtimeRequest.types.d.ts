export interface AirtimeOptions {
    recipients: {
        phoneNumber: string;
        currencyCode: 'KES' | 'UGX' | 'TZS' | 'NGN';
        amount: number;
    }[];
}
export interface AirtimePostData {
    username: string;
    recipients: {
        phoneNumber: string;
        amount: String;
    }[];
}
export interface AirtimeResponse {
    numSent: number;
    totalAmount: string;
    totalDiscount: string;
    responses: {
        phoneNumber: string;
        amount: string;
        discount: string;
        status: 'Sent' | 'Failed';
        requestId: string;
        errorMessage: 'None' | string;
    }[];
    errorMessage?: 'None' | string;
}
