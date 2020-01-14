import joi from 'joi';
import { Credentials } from '../../../utils/getFullCredentials.types';
import {
  FindTransactionOptions, FindTransactionResponse, FindTransactionQueryParams, FindTransaction,
} from './findTransaction.types';
import { getFullCredentials } from '../../../utils/getFullCredentials';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';

const getSchema = () => joi.object({
  transactionId: joi.string().required(),
}).required();

export const findTransaction = (
  credentials: Credentials,
): FindTransaction => async (options) => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<FindTransactionOptions>(getSchema(), options);

  const queryParams: FindTransactionQueryParams = {
    ...result,
    username,
  };

  return sendRequest<FindTransactionResponse, null, FindTransactionQueryParams>({
    endpointCategory: 'FIND_TRANSACTION',
    username,
    method: 'GET',
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/json',
    },
    params: queryParams,
  });
};
