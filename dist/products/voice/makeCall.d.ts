import { Credentials } from '../../utils/getFullCredentials.types';
import { MakeCallResponse, MakeCallOptions } from './makeCall.types';
export declare const makeCall: (credentials: Credentials) => (options: MakeCallOptions) => Promise<MakeCallResponse>;
