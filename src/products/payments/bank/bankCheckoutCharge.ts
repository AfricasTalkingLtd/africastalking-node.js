import joi from 'joi';
import { Credentials } from '../../../utils/getFullCredentials.types';
import { BankCheckoutChargeOptions, BankCheckoutChargeResponse, BankCheckoutChargePostData } from './bankCheckoutCharge.types';
import { getFullCredentials } from '../../../utils/getFullCredentials';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';

const getSchema = () => joi.object({
  productName: joi.string().regex(/\S/, 'no space').required(),
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
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<BankCheckoutChargeOptions>(getSchema(), options);

  const data: BankCheckoutChargePostData = {
    ...result,
    username,
  };

  return sendRequest<BankCheckoutChargeResponse, BankCheckoutChargePostData>({
    endpointCategory: 'BANK_CHECKOUT_CHARGE',
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
