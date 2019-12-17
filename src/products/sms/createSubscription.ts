import joi from 'joi';
import { validateJoiSchema, sendRequest } from '../../utils/misc';
import { CreateSubscriptionOptions, CreateSubscriptionResponse, CreateSubscriptionPostData } from './createSubscription.interface';
import { FullCredentials } from '../index.interface';

const getSchema = () => joi.object({
  shortCode: joi.string().required(),
  keyword: joi.string().required(),
  phoneNumber: (joi.string() as any).pattern(/^\+\d{1,3}\d{3,}$/).required(),
  checkoutToken: joi.string().required(),
});

export const createSubscription = (fullCredentials: FullCredentials) => async (
  options: CreateSubscriptionOptions,
): Promise<CreateSubscriptionResponse> => {
  const result = await validateJoiSchema<CreateSubscriptionOptions>(getSchema(), options);

  const { apiKey, username, format } = fullCredentials;
  const postData: CreateSubscriptionPostData = { ...result, username };

  return sendRequest<CreateSubscriptionResponse, CreateSubscriptionPostData>('CREATE_SUBSCRIPTION', username, 'POST', postData, {
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/json',
    },
  });
};
