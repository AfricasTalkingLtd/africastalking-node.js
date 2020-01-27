export interface FetchApplicationDataQueryParams {
    username: string;
}
export interface FetchApplicationDataResponse {
    UserData: {
        balance: string;
    };
}
export declare type FetchApplicationData = () => Promise<FetchApplicationDataResponse>;
