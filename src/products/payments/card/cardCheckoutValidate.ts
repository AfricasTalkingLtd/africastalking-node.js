import joi from 'joi';
import { Credentials } from '../../../utils/getFullCredentials.d';
import { CardCheckoutValidateOptions, CardCheckoutValidateResponse, CardCheckoutValidatePostData } from './cardCheckoutValidate.d';
import { getFullCredentials } from '../../../utils/getFullCredentials';
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

  const data: CardCheckoutValidatePostData = {
    ...result,
    username,
  };

  return sendRequest<CardCheckoutValidateResponse, CardCheckoutValidatePostData>({
    urlCategory: 'CARD_CHECKOUT_VALIDATE',
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
