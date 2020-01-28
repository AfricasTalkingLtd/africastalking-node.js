import joi from 'joi';
import {
  FetchMessagesResponse, FetchMessagesQueryParams, FetchMessages, FetchMessagesOptions,
} from './fetchMessages.types';
import { sendRequest, validateJoiSchema } from '../../utils/misc';
import { getFullCredentials } from '../../utils/getFullCredentials';
import { Credentials } from '../../utils/getFullCredentials.types';

const getSchema = () => joi.object({
  lastReceivedId: joi.number(),
});

export const fetchMessages = (
  credentials: Credentials,
): FetchMessages => async (options) => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<FetchMessagesOptions>(getSchema(), options);

  const queryParams: FetchMessagesQueryParams = {
    username,
    lastReceivedId: result?.lastReceivedId ?? '0',
  };

  return sendRequest<FetchMessagesResponse, null, FetchMessagesQueryParams>({
    endpointCategory: 'SMS',
    username,
    method: 'GET',
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/json',
    },
    params: queryParams,
  });
};
