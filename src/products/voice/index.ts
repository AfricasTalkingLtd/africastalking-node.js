import { Voice } from './index.types';
import { Credentials } from '../../utils/getFullCredentials.types';
import { ActionBuilder } from './utils/actionBuilder';
import { getNumQueuedCalls } from './getNumQueuedCalls';
import { makeCall } from './makeCall';
import { uploadMediaFile } from './uploadMediaFile';
import { showDeprecationWarning } from '../../utils/misc';

// exports 1: types
export { GetNumQueuedCallsOptions, GetNumQueuedCallsResponse } from './getNumQueuedCalls.types';
export { MakeCallOptions, MakeCallResponse } from './makeCall.types';
export { UploadMediaFileOptions, UploadMediaFileResponse } from './uploadMediaFile.types';

// exports 2: pure functions
export { ActionBuilder } from './utils/actionBuilder';
export { getNumQueuedCalls } from './getNumQueuedCalls';
export { makeCall } from './makeCall';
export { uploadMediaFile } from './uploadMediaFile';

// exports 3: instance-based functions
export const VOICE = (credentials: Credentials): Voice => ({
  ActionBuilder,
  makeCall: makeCall(credentials),
  getNumQueuedCalls: getNumQueuedCalls(credentials),
  uploadMediaFile: uploadMediaFile(credentials),

  get call() {
    showDeprecationWarning('VOICE.call()', 'VOICE.makeCall()', 'minor');
    return makeCall(credentials);
  },
});
