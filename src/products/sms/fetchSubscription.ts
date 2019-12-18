import joi from 'joi';
import { FetchSubscriptionOptions, FetchSubscriptionResponse, FetchSubscriptionPostData } from './fetchSubscription.interface';
import { validateJoiSchema, sendRequest } from '../../utils/misc';
import { Credentials } from '../../utils/getCredentials.interface';
import { getFullCredentials } from '../../utils/getCredentials';

const getSchema = () => joi.object({
  shortCode: joi.string().required(),
  keyword: joi.string().required(),
  lastReceivedId: joi.number(),
});

export const fetchSubscription = (credentials: Credentials) => async (
  options: FetchSubscriptionOptions,
): Promise<FetchSubscriptionResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = await validateJoiSchema<FetchSubscriptionOptions>(getSchema(), options);

  return sendRequest<FetchSubscriptionResponse, null>('CREATE_SUBSCRIPTION', username, 'GET', null, {
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/json',
    },
    params: {
      ...result,
      username,
      lastReceivedId: result.lastReceivedId || 0,
    } as FetchSubscriptionPostData,
  });
};
