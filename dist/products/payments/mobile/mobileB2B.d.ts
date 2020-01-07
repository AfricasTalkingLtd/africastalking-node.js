import { Credentials } from '../../../utils/getFullCredentials.types';
import { MobileB2BOptions, MobileB2BResponse } from './mobileB2B.types';
export declare const mobileB2B: (credentials: Credentials) => (options: MobileB2BOptions) => Promise<MobileB2BResponse>;
