import joi from 'joi';
import { MobileCheckoutResponse, MobileCheckoutOptions, MobileCheckoutPostData } from './mobileCheckout.interface';
import { Credentials } from '../../utils/getCredentials.interface';
import { getFullCredentials } from '../../utils/getCredentials';
import { sendRequest, validateJoiSchema } from '../../utils/misc';

const getSchema = () => joi.object({
  productName: (joi.string() as any).pattern(/\S/).required(), // TODO: 'must not contain invalid productName - eg. Space'
  providerChannel: joi.string(),
  phoneNumber: (joi.string() as any).pattern(/^\+\d{1,3}\d{3,}$/).required(),
  currencyCode: joi.string().valid('KES', 'UGX', 'USD').required(),
  amount: joi.number().required(),
  metadata: joi.object(),
}).required();

export const mobileCheckout = (credentials: Credentials) => async (
  options: MobileCheckoutOptions,
): Promise<MobileCheckoutResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = await validateJoiSchema<MobileCheckoutOptions>(getSchema(), options);

  const postData: MobileCheckoutPostData = {
    ...result,
    username,
  };

  return sendRequest('MOBILE_CHECKOUT', username, 'POST', postData, {
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};
