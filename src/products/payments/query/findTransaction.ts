import joi from 'joi';
import { Credentials } from '../../../utils/getCredentials.interface';
import { FindTransactionOptions, FindTransactionResponse, FindTransactionQueryParams } from './findTransaction.interface';
import { getFullCredentials } from '../../../utils/getCredentials';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';

const getSchema = () => joi.object({
  transactionId: joi.string().required(),
}).required();

export const findTransaction = (credentials: Credentials) => async (
  options: FindTransactionOptions,
): Promise<FindTransactionResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = await validateJoiSchema<FindTransactionOptions>(getSchema(), options);

  const queryParams: FindTransactionQueryParams = {
    ...result,
    username,
  };

  return sendRequest<FindTransactionResponse, null, FindTransactionQueryParams>('FETCH_PRODUCT_TRANSACTIONS',
    username, 'GET', null, {
      headers: {
        apiKey,
        accept: format,
        'Content-Type': 'application/json',
      },
      params: queryParams,
    });
};
