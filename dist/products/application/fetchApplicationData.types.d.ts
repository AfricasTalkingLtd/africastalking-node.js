export interface ApplicationQueryParams {
    username: string;
}
export interface ApplicationResponse {
    UserData: {
        balance: string;
    };
}
export declare type FetchApplicationData = () => Promise<ApplicationResponse>;
