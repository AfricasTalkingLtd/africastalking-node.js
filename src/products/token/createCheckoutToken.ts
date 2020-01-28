import joi from 'joi';
import queryString from 'query-string';
import { Credentials } from '../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../utils/getFullCredentials';
import { sendRequest, validateJoiSchema } from '../../utils/misc';
import {
  CreateCheckoutTokenOptions, CreateCheckoutTokenResponse,
  CreateCheckoutTokenPostData, CreateCheckoutToken,
} from './createCheckoutToken.types';
import { customRegex } from '../../utils/constants';

const getSchema = () => joi.object({
  phoneNumber: joi.string().regex(customRegex.phoneNumber, 'phone number').required(),
}).required();

export const createCheckoutToken = (
  credentials: Credentials,
): CreateCheckoutToken => async (phoneNumber) => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<CreateCheckoutTokenOptions>(getSchema(), { phoneNumber });

  const data: CreateCheckoutTokenPostData = { ...result };

  return sendRequest<CreateCheckoutTokenResponse, string>({
    endpointCategory: 'CREATE_CHECKOUT_TOKEN',
    username,
    method: 'POST',
    data: queryString.stringify(data),
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((checkoutTokenResult) => {
      if (checkoutTokenResult.token == null || checkoutTokenResult.token === 'None') {
        return Promise.reject(checkoutTokenResult.description);
      }

      return Promise.resolve(checkoutTokenResult);
    });
};
