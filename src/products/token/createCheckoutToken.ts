import joi from 'joi';
import { Credentials } from '../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../utils/getFullCredentials';
import { sendRequest, validateJoiSchema } from '../../utils/misc';
import { CreateCheckoutTokenOptions, CreateCheckoutTokenResponse, CreateCheckoutTokenPostData } from './createCheckoutToken.types';

const getSchema = () => joi.object({
  phoneNumber: joi.string().regex(/^\+\d{1,3}\d{3,}$/, 'phone number').required(),
}).required();

export const createCheckoutToken = (credentials: Credentials) => async (
  phoneNumber: string,
): Promise<CreateCheckoutTokenResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = validateJoiSchema<CreateCheckoutTokenOptions>(getSchema(), { phoneNumber });

  const data: CreateCheckoutTokenPostData = { ...result };

  return sendRequest<CreateCheckoutTokenResponse, CreateCheckoutTokenPostData>({
    endpointCategory: 'CREATE_CHECKOUT_TOKEN',
    username,
    method: 'POST',
    data,
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((result2) => {
      if (result2.token == null || result2.token === 'None') {
        return Promise.reject(result2.description);
      }

      return Promise.resolve(result2);
    });
};
