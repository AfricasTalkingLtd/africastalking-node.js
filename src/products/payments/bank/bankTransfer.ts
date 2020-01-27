import joi from 'joi';
import { Credentials } from '../../../utils/getFullCredentials.types';
import {
  BankTransferOptions, BankTransferResponse, BankTransferPostData, BankTransfer,
} from './bankTransfer.types';
import { getFullCredentials } from '../../../utils/getFullCredentials';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';
import { customRegex } from '../../../utils/constants';

const getSchema = () => joi.object({
  productName: joi.string().regex(customRegex.noSpace, 'no space').required(),
  recipients: joi.array().items(
    joi.object({
      bankAccount: joi.object({
        accountName: joi.string().required(),
        accountNumber: joi.string().required(),
        bankCode: joi.number().required(),
        dateOfBirth: joi.string(),
      }).required(),
      currencyCode: joi.string().valid('KES', 'UGX', 'USD').required(),
      amount: joi.number().required(),
      narration: joi.string().regex(customRegex.noSpace, 'no space').required(),
      metadata: joi.object(),
    }).required(),
  ).min(1).required(),
}).required();

export const bankTransfer = (
  credentials: Credentials,
) : BankTransfer => async (options) => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<BankTransferOptions>(getSchema(), options);

  const data: BankTransferPostData = {
    ...result,
    username,
  };

  return sendRequest<BankTransferResponse, BankTransferPostData>({
    endpointCategory: 'BANK_TRANSFER',
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
