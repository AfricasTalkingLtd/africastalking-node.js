import { Credentials } from '../../utils/getFullCredentials.types';
export declare const APPLICATION: (credentials: Credentials) => {
    fetchApplicationData: () => Promise<import("./fetchApplicationData.types").ApplicationResponse>;
    fetchAccount: () => Promise<import("./fetchApplicationData.types").ApplicationResponse>;
};
