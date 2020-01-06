import { Credentials } from '../../utils/getFullCredentials.types';
import { makeCall } from './makeCall';
import { getNumQueuedCalls } from './getNumQueuedCalls';
import { uploadMediaFile } from './uploadMediaFile';

export const VOICE = (credentials: Credentials) => ({
  call: makeCall(credentials),
  getNumQueuedCalls: getNumQueuedCalls(credentials),
  uploadMediaFile: uploadMediaFile(credentials),

  // TODO:
  // ActionBuilder: ...
});
