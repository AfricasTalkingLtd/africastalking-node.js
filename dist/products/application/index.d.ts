import { Application } from './index.types';
import { Credentials } from '../../utils/getFullCredentials.types';
export { FetchApplicationDataResponse } from './fetchApplicationData.types';
export { fetchApplicationData } from './fetchApplicationData';
export declare const APPLICATION: (credentials: Credentials) => Application;
