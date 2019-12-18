import joi from 'joi';
import { Credentials } from '../../utils/getCredentials.interface';
import { BankCheckoutChargeOptions, BankCheckoutChargeResponse, BankCheckoutChargePostData } from './bankCheckoutCharge.interface';
import { getFullCredentials } from '../../utils/getCredentials';
import { validateJoiSchema, sendRequest } from '../../utils/misc';

const getSchema = () => joi.object({
  productName: joi.string().regex(/\S/, 'no space').required,
  bankAccount: joi.object({
    accountName: joi.string().required(),
    accountNumber: joi.string().required(),
    bankCode: joi.number().required(),
    dateOfBirth: joi.string(),
  }).required(),
  currencyCode: joi.string().valid('KES', 'UGX', 'USD').required(),
  amount: joi.number().required(),
  narration: joi.string().regex(/\S/, 'no space').required(),
  metadata: joi.object(),
}).required();

export const bankCheckoutCharge = (credentials: Credentials) => async (
  options: BankCheckoutChargeOptions,
): Promise<BankCheckoutChargeResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = await validateJoiSchema<BankCheckoutChargeOptions>(getSchema(), options);

  const postData: BankCheckoutChargePostData = {
    ...result,
    username,
  };

  return sendRequest<BankCheckoutChargeResponse, BankCheckoutChargePostData>('BANK_CHECKOUT_CHARGE', username, 'POST', postData, {
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/json',
    },
  });
};
