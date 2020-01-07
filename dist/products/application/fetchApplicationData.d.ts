import { ApplicationResponse } from './fetchApplicationData.types';
import { Credentials } from '../../utils/getFullCredentials.types';
export declare const fetchApplicationData: (credentials: Credentials) => () => Promise<ApplicationResponse>;
