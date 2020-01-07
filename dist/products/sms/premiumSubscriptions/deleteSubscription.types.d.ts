export interface DeleteSubscriptionOptions {
    shortCode: string;
    keyword: string;
    phoneNumber: string;
}
export declare type DeleteSubscriptionPostData = DeleteSubscriptionOptions & {
    username: string;
};
export interface DeleteSubscriptionResponse {
    status: 'Success' | 'Failed';
    description: string;
}
