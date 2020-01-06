import joi from 'joi';
import { MobileCheckoutResponse, MobileCheckoutOptions, MobileCheckoutPostData } from './mobileCheckout.types';
import { Credentials } from '../../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../../utils/getFullCredentials';
import { sendRequest, validateJoiSchema } from '../../../utils/misc';

const getSchema = () => joi.object({
  productName: joi.string().regex(/\S/, 'no space').required(),
  providerChannel: joi.string(),
  phoneNumber: joi.string().regex(/^\+\d{1,3}\d{3,}$/, 'phone number').required(),
  currencyCode: joi.string().valid('KES', 'UGX', 'USD').required(),
  amount: joi.number().required(),
  metadata: joi.object(),
}).required();

export const mobileCheckout = (credentials: Credentials) => async (
  options: MobileCheckoutOptions,
): Promise<MobileCheckoutResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = await validateJoiSchema<MobileCheckoutOptions>(getSchema(), options);

  const data: MobileCheckoutPostData = {
    ...result,
    username,
  };

  return sendRequest<MobileCheckoutResponse, MobileCheckoutPostData>({
    urlCategory: 'MOBILE_CHECKOUT',
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
