import joi from 'joi';
import { Credentials } from '../../../utils/getFullCredentials.types';
import { BankCheckoutValidateOptions, BankCheckoutValidateResponse, BankCheckoutValidatePostData } from './bankCheckoutValidate.types';
import { getFullCredentials } from '../../../utils/getFullCredentials';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';

const getSchema = () => joi.object({
  transactionId: joi.string().regex(/\S/, 'no space').required(),
  otp: joi.string().regex(/\S/, 'no space').required(),
}).required();

export const bankCheckoutValidate = (credentials: Credentials) => async (
  options: BankCheckoutValidateOptions,
): Promise<BankCheckoutValidateResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = await validateJoiSchema<BankCheckoutValidateOptions>(getSchema(), options);

  const data: BankCheckoutValidatePostData = {
    ...result,
    username,
  };

  return sendRequest<BankCheckoutValidateResponse, BankCheckoutValidatePostData>({
    urlCategory: 'BANK_CHECKOUT_VALIDATE',
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
