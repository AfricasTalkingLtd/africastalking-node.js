import joi from 'joi';
import {
  FetchSubscriptionOptions, FetchSubscriptionResponse,
  FetchSubscriptionQueryParams, FetchSubscription,
} from './fetchSubscription.types';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';
import { Credentials } from '../../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../../utils/getFullCredentials';

const getSchema = () => joi.object({
  shortCode: joi.string().required(),
  keyword: joi.string().required(),
  lastReceivedId: joi.number(),
});

export const fetchSubscription = (
  credentials: Credentials,
): FetchSubscription => async (options) => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<FetchSubscriptionOptions>(getSchema(), options);

  const queryParams: FetchSubscriptionQueryParams = {
    ...result,
    username,
    lastReceivedId: result.lastReceivedId || 0,
  };

  return sendRequest<FetchSubscriptionResponse, null, FetchSubscriptionQueryParams>({
    endpointCategory: 'FETCH_SUBSCRIPTION',
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
