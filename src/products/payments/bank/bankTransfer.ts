import joi from 'joi';
import { Credentials } from '../../../utils/getCredentials.interface';
import { BankTransferOptions, BankTransferResponse, BankTransferPostData } from './bankTransfer.interface';
import { getFullCredentials } from '../../../utils/getCredentials';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';

const getSchema = () => joi.object({
  productName: joi.string().regex(/\S/, 'no space').required(),
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
      narration: joi.string().regex(/\S/, 'no space').required(),
      metadata: joi.object(),
    }).required(),
  ).min(1).required(),
}).required();

export const bankTransfer = (credentials: Credentials) => async (
  options: BankTransferOptions,
): Promise<BankTransferResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = await validateJoiSchema<BankTransferOptions>(getSchema(), options);

  const postData: BankTransferPostData = {
    ...result,
    username,
  };

  return sendRequest<BankTransferResponse, BankTransferPostData>('BANK_TRANSFER', username, 'POST', postData, {
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/json',
    },
  });
};
