import joi from 'joi';
import queryString from 'query-string';
import { Credentials } from '../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../utils/getFullCredentials';
import { sendRequest, validateJoiSchema } from '../../utils/misc';
import { GetNumQueuedCallsOptions, GetNumQueuedCallsPostData, GetNumQueuedCallsResponse } from './getNumQueuedCalls.types';

const getSchema = () => joi.object({
  phoneNumbers: joi.string().required(),
}).schema();

export const getNumQueuedCalls = (credentials: Credentials) => async (
  options: GetNumQueuedCallsOptions,
): Promise<GetNumQueuedCallsResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = await validateJoiSchema<GetNumQueuedCallsOptions>(getSchema(), options);

  const data: GetNumQueuedCallsPostData = { ...result, username };

  return sendRequest<GetNumQueuedCallsResponse, string>({
    urlCategory: 'GET_NUM_QUEUED_CALLS',
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
