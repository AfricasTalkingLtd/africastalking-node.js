import { Credentials } from '../../../utils/getFullCredentials.types';
import { MobileDataOptions, MobileDataResponse } from './mobileData.types';
export declare const mobileData: (credentials: Credentials) => (options: MobileDataOptions) => Promise<MobileDataResponse>;
