import joi from 'joi';
import { Credentials } from '../../../utils/getFullCredentials.types';
import {
  BankCheckoutValidateOptions, BankCheckoutValidateResponse,
  BankCheckoutValidatePostData, BankCheckoutValidate,
} from './bankCheckoutValidate.types';
import { getFullCredentials } from '../../../utils/getFullCredentials';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';
import { customRegex } from '../../../utils/constants';

const getSchema = () => joi.object({
  transactionId: joi.string().regex(customRegex.noSpace, 'no space').required(),
  otp: joi.string().regex(customRegex.noSpace, 'no space').required(),
}).required();

export const bankCheckoutValidate = (
  credentials: Credentials,
): BankCheckoutValidate => async (options) => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<BankCheckoutValidateOptions>(getSchema(), options);

  const data: BankCheckoutValidatePostData = {
    ...result,
    username,
  };

  return sendRequest<BankCheckoutValidateResponse, BankCheckoutValidatePostData>({
    endpointCategory: 'BANK_CHECKOUT_VALIDATE',
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
