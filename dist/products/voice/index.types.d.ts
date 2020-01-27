import { ActionBuilder } from './utils/actionBuilder';
import { MakeCall } from './makeCall.types';
import { GetNumQueuedCalls } from './getNumQueuedCalls.types';
import { UploadMediaFile } from './uploadMediaFile.types';
export interface Voice {
    ActionBuilder: typeof ActionBuilder;
    makeCall: MakeCall;
    getNumQueuedCalls: GetNumQueuedCalls;
    uploadMediaFile: UploadMediaFile;
    call: MakeCall;
}
