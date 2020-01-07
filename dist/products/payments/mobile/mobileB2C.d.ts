import { Credentials } from '../../../utils/getFullCredentials.types';
import { MobileB2COptions, MobileB2CResponse } from './mobileB2C.types';
export declare const mobileB2C: (credentials: Credentials) => (options: MobileB2COptions) => Promise<MobileB2CResponse>;
