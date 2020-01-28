import joi from 'joi';
import queryString from 'query-string';
import {
  DeleteSubscriptionOptions, DeleteSubscriptionResponse,
  DeleteSubscriptionPostData, DeleteSubscription,
} from './deleteSubscription.types';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';
import { Credentials } from '../../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../../utils/getFullCredentials';
import { customRegex } from '../../../utils/constants';

const getSchema = () => joi.object({
  shortCode: joi.string().required(),
  keyword: joi.string().required(),
  phoneNumber: joi.string().regex(customRegex.phoneNumber, 'phone number').required(),
}).required();

export const deleteSubscription = (
  credentials: Credentials,
): DeleteSubscription => async (options) => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<DeleteSubscriptionOptions>(getSchema(), options);

  const data: DeleteSubscriptionPostData = { ...result, username };

  return sendRequest<DeleteSubscriptionResponse, string>({
    endpointCategory: 'DELETE_SUBSCRIPTION',
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
