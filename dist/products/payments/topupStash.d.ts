import { Credentials } from '../../utils/getFullCredentials.types';
import { TopupStashOptions, TopupStashResponse } from './topupStash.types';
export declare const topupStash: (credentials: Credentials) => (options: TopupStashOptions) => Promise<TopupStashResponse>;
