import joi from 'joi';
import { Credentials } from '../../../utils/getFullCredentials.d';
import { BankCheckoutChargeOptions, BankCheckoutChargeResponse, BankCheckoutChargePostData } from './bankCheckoutCharge.d';
import { getFullCredentials } from '../../../utils/getFullCredentials';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';

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

  const data: BankCheckoutChargePostData = {
    ...result,
    username,
  };

  return sendRequest<BankCheckoutChargeResponse, BankCheckoutChargePostData>({
    urlCategory: 'BANK_CHECKOUT_CHARGE',
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
