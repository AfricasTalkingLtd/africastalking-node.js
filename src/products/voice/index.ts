import { Voice } from './index.types';
import { Credentials } from '../../utils/getFullCredentials.types';
import { ActionBuilder } from './utils/actionBuilder';
import { getNumQueuedCalls } from './getNumQueuedCalls';
import { makeCall } from './makeCall';
import { uploadMediaFile } from './uploadMediaFile';

export const voice = (credentials: Credentials): Voice => ({
  ActionBuilder,
  call: makeCall(credentials),
  getNumQueuedCalls: getNumQueuedCalls(credentials),
  uploadMediaFile: uploadMediaFile(credentials),
});
