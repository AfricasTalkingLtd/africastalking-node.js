import joi from 'joi';
import { Credentials } from '../../../utils/getCredentials.interface';
import { CardCheckoutValidateOptions, CardCheckoutValidateResponse, CardCheckoutValidatePostData } from './cardCheckoutValidate.interface';
import { getFullCredentials } from '../../../utils/getCredentials';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';

const getSchema = () => joi.object({
  transactionId: joi.string().regex(/\S/, 'no space').required(),
  otp: joi.string().regex(/\S/, 'no space').required(),
}).required();

export const cardCheckoutValidate = (credentials: Credentials) => async (
  options: CardCheckoutValidateOptions,
): Promise<CardCheckoutValidateResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = await validateJoiSchema<CardCheckoutValidateOptions>(getSchema(), options);

  const postData: CardCheckoutValidatePostData = {
    ...result,
    username,
  };

  return sendRequest<CardCheckoutValidateResponse, CardCheckoutValidatePostData>('BANK_CHECKOUT_VALIDATE', username, 'POST', postData, {
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/json',
    },
  });
};
