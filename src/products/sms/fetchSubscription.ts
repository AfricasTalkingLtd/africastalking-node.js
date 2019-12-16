import joi from 'joi';
import { FullCredentials } from '../index.interface';
import { FetchSubscriptionOptions, FetchSubscriptionResponse, FetchSubscriptionPostData } from './fetchSubscription.interface';
import { validateJoiSchema, sendRequest } from '../../utils/misc';

const getSchema = () => joi.object({
  shortCode: joi.string().required(),
  keyword: joi.string().required(),
  lastReceivedId: joi.number(),
});

export const fetchSubscription = async (
  fullCredentials: FullCredentials, options: FetchSubscriptionOptions,
): Promise<FetchSubscriptionResponse> => {
  const result = await validateJoiSchema<FetchSubscriptionOptions>(getSchema(), options);

  const { apiKey, username, format } = fullCredentials;

  return sendRequest<FetchSubscriptionResponse, null>('CREATE_SUBSCRIPTION', username, 'POST', null, {
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
