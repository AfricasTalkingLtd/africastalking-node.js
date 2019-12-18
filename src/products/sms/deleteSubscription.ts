import joi from 'joi';
import querystring from 'query-string';
import { DeleteSubscriptionOptions, DeleteSubscriptionResponse, DeleteSubscriptionPostData } from './deleteSubscription.interface';
import { validateJoiSchema, sendRequest } from '../../utils/misc';
import { Credentials } from '../../utils/getCredentials.interface';
import { getFullCredentials } from '../../utils/getCredentials';

const getSchema = () => joi.object({
  shortCode: joi.string().required(),
  keyword: joi.string().required(),
  phoneNumber: (joi.string() as any).pattern(/^\+\d{1,3}\d{3,}$/).required(),
}).required();

export const deleteSubscription = (credentials: Credentials) => async (
  options: DeleteSubscriptionOptions,
): Promise<DeleteSubscriptionResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = await validateJoiSchema<DeleteSubscriptionOptions>(getSchema(), options);

  const postData: DeleteSubscriptionPostData = { ...result, username };

  return sendRequest<DeleteSubscriptionResponse, string>('DELETE_SUBSCRIPTION', username, 'POST', querystring.stringify(postData), {
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};
