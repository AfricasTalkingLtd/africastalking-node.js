import { Credentials } from '../../utils/getFullCredentials.types';
export declare const TOKEN: (credentials: Credentials) => {
    generateAuthToken: () => Promise<import("./generateAuthToken.types").GenerateAuthTokenResponse>;
    createCheckoutToken: (phoneNumber: string) => Promise<import("./createCheckoutToken.types").CreateCheckoutTokenResponse>;
};
