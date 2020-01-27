import joi from 'joi';
import {
  MobileCheckoutResponse, MobileCheckoutOptions, MobileCheckoutPostData, MobileCheckout,
} from './mobileCheckout.types';
import { Credentials } from '../../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../../utils/getFullCredentials';
import { sendRequest, validateJoiSchema } from '../../../utils/misc';
import { customRegex } from '../../../utils/constants';

const getSchema = () => joi.object({
  productName: joi.string().regex(customRegex.noSpace, 'no space').required(),
  providerChannel: joi.string(),
  phoneNumber: joi.string().regex(customRegex.phoneNumber, 'phone number').required(),
  currencyCode: joi.string().valid('KES', 'UGX', 'USD').required(),
  amount: joi.number().required(),
  metadata: joi.object(),
}).required();

export const mobileCheckout = (
  credentials: Credentials,
): MobileCheckout => async (options) => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<MobileCheckoutOptions>(getSchema(), options);

  const data: MobileCheckoutPostData = {
    ...result,
    username,
  };

  return sendRequest<MobileCheckoutResponse, MobileCheckoutPostData>({
    endpointCategory: 'MOBILE_CHECKOUT',
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
