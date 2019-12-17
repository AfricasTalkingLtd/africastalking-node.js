import joi from 'joi';
import querystring from 'query-string';
import { FullCredentials } from '../index.interface';
import { DeleteSubscriptionOptions, DeleteSubscriptionResponse, DeleteSubscriptionPostData } from './deleteSubscription.interface';
import { validateJoiSchema, sendRequest } from '../../utils/misc';

const getSchema = () => joi.object({
  shortCode: joi.string().required(),
  keyword: joi.string().required(),
  phoneNumber: (joi.string() as any).pattern(/^\+\d{1,3}\d{3,}$/).required(),
});

export const deleteSubscription = (fullCredentials: FullCredentials) => async (
  options: DeleteSubscriptionOptions,
): Promise<DeleteSubscriptionResponse> => {
  const result = await validateJoiSchema<DeleteSubscriptionOptions>(getSchema(), options);

  const { apiKey, username, format } = fullCredentials;
  const postData: DeleteSubscriptionPostData = { ...result, username };

  return sendRequest<DeleteSubscriptionResponse, string>('DELETE_SUBSCRIPTION', username, 'POST', querystring.stringify(postData), {
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};
