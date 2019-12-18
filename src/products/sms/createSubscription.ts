import joi from 'joi';
import { validateJoiSchema, sendRequest } from '../../utils/misc';
import { CreateSubscriptionOptions, CreateSubscriptionResponse, CreateSubscriptionPostData } from './createSubscription.interface';
import { Credentials } from '../../utils/getCredentials.interface';
import { getFullCredentials } from '../../utils/getCredentials';

const getSchema = () => joi.object({
  shortCode: joi.string().required(),
  keyword: joi.string().required(),
  phoneNumber: (joi.string() as any).pattern(/^\+\d{1,3}\d{3,}$/).required(),
  checkoutToken: joi.string().required(),
}).schema();

export const createSubscription = (credentials: Credentials) => async (
  options: CreateSubscriptionOptions,
): Promise<CreateSubscriptionResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = await validateJoiSchema<CreateSubscriptionOptions>(getSchema(), options);

  const postData: CreateSubscriptionPostData = { ...result, username };

  return sendRequest<CreateSubscriptionResponse, CreateSubscriptionPostData>('CREATE_SUBSCRIPTION', username, 'POST', postData, {
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/json',
    },
  });
};
