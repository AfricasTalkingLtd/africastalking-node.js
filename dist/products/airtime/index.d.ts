import { Credentials } from '../../utils/getFullCredentials.types';
export declare const AIRTIME: (credentials: Credentials) => {
    send: (options: import("./sendAirtimeRequest.types").AirtimeOptions) => Promise<import("./sendAirtimeRequest.types").AirtimeResponse>;
};
