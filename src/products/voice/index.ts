import { Credentials } from '../../utils/getFullCredentials.types';
import { makeCall } from './makeCall';
import { getNumQueuedCalls } from './getNumQueuedCalls';
import { uploadMediaFile } from './uploadMediaFile';
import { ActionBuilder } from './utils/actionBuilder';

export const VOICE = (credentials: Credentials) => ({
  ActionBuilder,
  call: makeCall(credentials),
  getNumQueuedCalls: getNumQueuedCalls(credentials),
  uploadMediaFile: uploadMediaFile(credentials),
});
