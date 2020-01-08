import joi from 'joi';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';
import { CreateSubscriptionOptions, CreateSubscriptionResponse, CreateSubscriptionPostData } from './createSubscription.types';
import { Credentials } from '../../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../../utils/getFullCredentials';

const getSchema = () => joi.object({
  shortCode: joi.string().required(),
  keyword: joi.string().required(),
  phoneNumber: joi.string().regex(/^\+\d{1,3}\d{3,}$/, 'phone number').required(),
  checkoutToken: joi.string().required(),
}).required();

export const createSubscription = (credentials: Credentials) => async (
  options: CreateSubscriptionOptions,
): Promise<CreateSubscriptionResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = validateJoiSchema<CreateSubscriptionOptions>(getSchema(), options);

  const data: CreateSubscriptionPostData = { ...result, username };

  return sendRequest<CreateSubscriptionResponse, CreateSubscriptionPostData>({
    endpointCategory: 'CREATE_SUBSCRIPTION',
    username,
    method: 'POST',
    data,
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/json',
    },
  });
};
