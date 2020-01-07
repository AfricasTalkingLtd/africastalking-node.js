import { Credentials } from '../../utils/getFullCredentials.types';
import { ActionBuilder } from './utils/actionBuilder';
export declare const VOICE: (credentials: Credentials) => {
    ActionBuilder: ActionBuilder;
    call: (options: import("./makeCall.types").MakeCallOptions) => Promise<import("./makeCall.types").MakeCallResponse>;
    getNumQueuedCalls: (options: import("./getNumQueuedCalls.types").GetNumQueuedCallsOptions) => Promise<import("./getNumQueuedCalls.types").GetNumQueuedCallsResponse>;
    uploadMediaFile: (options: import("./uploadMediaFile.types").UploadMediaFileOptions) => Promise<import("./uploadMediaFile.types").UploadMediaFileResponse>;
};
