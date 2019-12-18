import joi from 'joi';
import { Credentials } from '../../../utils/getCredentials.interface';
import { MobileB2COptions, MobileB2CResponse, MobileB2CPostData } from './mobileB2C.interface';
import { getFullCredentials } from '../../../utils/getCredentials';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';

const getSchema = () => joi.object({
  productName: joi.string().regex(/\S/, 'no space').required(),
  recipients: joi.array().items(
    joi.object({
      name: joi.string(),
      phoneNumber: joi.string().regex(/^\+?\d+$/, 'phone number').required(),
      currencyCode: joi.string().valid('KES', 'UGX', 'USD').required(),
      amount: joi.number().required(),
      providerChannel: joi.string(),
      reason: joi.string().valid('SalaryPayment', 'SalaryPaymentWithWithdrawalChargePaid',
        'BusinessPayment', 'BusinessPaymentWithWithdrawalChargePaid', 'PromotionPayment').required(),
      metadata: joi.object(),
    }).required(),
  ).min(1).max(10)
    .required(),
}).required();

export const mobileB2C = (credentials: Credentials) => async (
  options: MobileB2COptions,
): Promise<MobileB2CResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = await validateJoiSchema<MobileB2COptions>(getSchema(), options);

  const postData: MobileB2CPostData = {
    ...result,
    username,
  };

  return sendRequest<MobileB2CResponse, MobileB2CPostData>('MOBILE_B2C', username, 'POST', postData, {
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/json',
    },
  });
};
