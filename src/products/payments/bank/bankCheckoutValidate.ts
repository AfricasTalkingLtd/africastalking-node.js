import joi from 'joi';
import { Credentials } from '../../../utils/getCredentials.interface';
import { BankCheckoutValidateOptions, BankCheckoutValidateResponse, BankCheckoutValidatePostData } from './bankCheckoutValidate.interface';
import { getFullCredentials } from '../../../utils/getCredentials';
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

  const postData: BankCheckoutValidatePostData = {
    ...result,
    username,
  };

  return sendRequest<BankCheckoutValidateResponse, BankCheckoutValidatePostData>('BANK_CHECKOUT_VALIDATE', username, 'POST', postData, {
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/json',
    },
  });
};
