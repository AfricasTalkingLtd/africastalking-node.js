import joi from 'joi';
import querystring from 'query-string';
import { DeleteSubscriptionOptions, DeleteSubscriptionResponse, DeleteSubscriptionPostData } from './deleteSubscription.types';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';
import { Credentials } from '../../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../../utils/getFullCredentials';

const getSchema = () => joi.object({
  shortCode: joi.string().required(),
  keyword: joi.string().required(),
  phoneNumber: joi.string().regex(/^\+\d{1,3}\d{3,}$/, 'phone number').required(),
}).required();

export const deleteSubscription = (credentials: Credentials) => async (
  options: DeleteSubscriptionOptions,
): Promise<DeleteSubscriptionResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = validateJoiSchema<DeleteSubscriptionOptions>(getSchema(), options);

  const data: DeleteSubscriptionPostData = { ...result, username };

  return sendRequest<DeleteSubscriptionResponse, string>({
    endpointCategory: 'DELETE_SUBSCRIPTION',
    username,
    method: 'POST',
    data: querystring.stringify(data),
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};
