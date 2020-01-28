import joi from 'joi';
import queryString from 'query-string';
import { Credentials } from '../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../utils/getFullCredentials';
import { sendRequest, validateJoiSchema } from '../../utils/misc';
import {
  GetNumQueuedCallsOptions, GetNumQueuedCallsPostData, GetNumQueuedCallsResponse, GetNumQueuedCalls,
} from './getNumQueuedCalls.types';

const getSchema = () => joi.object({
  phoneNumbers: joi.string().required(),
}).required();

export const getNumQueuedCalls = (
  credentials: Credentials,
): GetNumQueuedCalls => async (options) => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<GetNumQueuedCallsOptions>(getSchema(), options);

  const data: GetNumQueuedCallsPostData = { ...result, username };

  return sendRequest<GetNumQueuedCallsResponse, string>({
    endpointCategory: 'GET_NUM_QUEUED_CALLS',
    username,
    method: 'POST',
    data: queryString.stringify(data),
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};
