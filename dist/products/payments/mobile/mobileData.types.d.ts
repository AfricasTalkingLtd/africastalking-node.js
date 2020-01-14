export interface MobileDataOptions {
    productName: string;
    recipients: {
        phoneNumber: string;
        quantity: number;
        unit: 'MB' | 'GB';
        validity: 'Day' | 'Month' | 'Week';
        metadata: {
            [key: string]: any;
        };
    }[];
}
export interface MobileDataPostData extends MobileDataOptions {
    username: string;
}
export interface MobileDataResponse {
}
export declare type MobileData = (options: MobileDataOptions) => Promise<MobileDataResponse>;
