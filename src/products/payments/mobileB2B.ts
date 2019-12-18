import joi from 'joi';
import { Credentials } from '../../utils/getCredentials.interface';
import { MobileB2BOptions, MobileB2BResponse, MobileB2BPostData } from './mobileB2B.interface';
import { getFullCredentials } from '../../utils/getCredentials';
import { validateJoiSchema, sendRequest } from '../../utils/misc';

const getSchema = () => joi.object({
  productName: joi.string().regex(/\S/, 'product name').required(),
  provider: joi.string().valid('Mpesa', 'TigoTanzania', 'Athena').required(),
  transferType: joi.string().valid('BusinessBuyGoods', 'BusinessPayBill',
    'DisburseFundsToBusiness', 'BusinessToBusinessTransfer').required(),
  currencyCode: joi.string().valid('KES', 'UGX', 'USD').required(),
  amount: joi.string().required(),
  destinationChannel: joi.string().required(),
  destinationAccount: joi.string().required(),
  metadata: joi.object(),
}).required();

export const mobileB2B = (credentials: Credentials) => async (
  options: MobileB2BOptions,
): Promise<MobileB2BResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = await validateJoiSchema<MobileB2BOptions>(getSchema(), options);

  const postData: MobileB2BPostData = {
    ...result,
    username,
  };

  return sendRequest<MobileB2BResponse, MobileB2BPostData>('MOBILE_B2B', username, 'POST', postData, {
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/json',
    },
  });
};
