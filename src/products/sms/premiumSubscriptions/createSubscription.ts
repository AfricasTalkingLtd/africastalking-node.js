import joi from 'joi';
import queryString from 'query-string';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';
import {
  CreateSubscriptionOptions, CreateSubscriptionResponse,
  CreateSubscriptionPostData, CreateSubscription,
} from './createSubscription.types';
import { Credentials } from '../../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../../utils/getFullCredentials';

const getSchema = () => joi.object({
  shortCode: joi.string().required(),
  keyword: joi.string().required(),
  phoneNumber: joi.string().regex(/^\+\d{1,3}\d{3,}$/, 'phone number').required(),
  checkoutToken: joi.string().required(),
}).required();

export const createSubscription = (
  credentials: Credentials,
): CreateSubscription => async (options) => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<CreateSubscriptionOptions>(getSchema(), options);

  const data: CreateSubscriptionPostData = { ...result, username };

  return sendRequest<CreateSubscriptionResponse, string>({
    endpointCategory: 'CREATE_SUBSCRIPTION',
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
