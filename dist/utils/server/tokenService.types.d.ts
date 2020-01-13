export interface GetTokenResponse {
    token: string;
    expiration: number;
    username: string;
    environment: 'sandbox' | 'production';
}
export declare type GetToken = (cxt: any, cb: (err: Error | null, response: GetTokenResponse | null) => void) => Promise<void>;
export interface SipCredential {
    username: string;
    password: string;
    host: string;
    port: number;
    transport: 'udp' | string;
}
export declare type GetSipCredentials = (_cxt: any, cb: (err: Error | null, response: {
    credentials: SipCredential[];
}) => void) => void;
export declare type AddSipCredentials = (username: string, password: string, host: string, port: number, transport: string) => void;
export interface TokenService {
    definition: any;
    implementation: {
        getToken: GetToken;
        getSipCredentials: GetSipCredentials;
    };
    addSipCredentials: AddSipCredentials;
}
