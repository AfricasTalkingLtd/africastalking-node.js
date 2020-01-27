import joi from 'joi';
import { Credentials } from '../../../utils/getFullCredentials.types';
import {
  CardCheckoutValidateOptions, CardCheckoutValidateResponse,
  CardCheckoutValidatePostData, CardCheckoutValidate,
} from './cardCheckoutValidate.types';
import { getFullCredentials } from '../../../utils/getFullCredentials';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';
import { customRegex } from '../../../utils/constants';

const getSchema = () => joi.object({
  transactionId: joi.string().regex(customRegex.noSpace, 'no space').required(),
  otp: joi.string().regex(customRegex.noSpace, 'no space').required(),
}).required();

export const cardCheckoutValidate = (
  credentials: Credentials,
): CardCheckoutValidate => async (options) => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<CardCheckoutValidateOptions>(getSchema(), options);

  const data: CardCheckoutValidatePostData = {
    ...result,
    username,
  };

  return sendRequest<CardCheckoutValidateResponse, CardCheckoutValidatePostData>({
    endpointCategory: 'CARD_CHECKOUT_VALIDATE',
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
