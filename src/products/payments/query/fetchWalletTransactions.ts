import joi from 'joi';
import { Credentials } from '../../../utils/getCredentials.interface';
import { FetchWalletTransactionsOptions, FetchWalletTransactionsResponse, FetchWalletTransactionsQueryParams } from './fetchWalletTransactions.interface';
import { getFullCredentials } from '../../../utils/getCredentials';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';

const getSchema = () => joi.object({
  pageNumber: joi.string().required(),
  count: joi.string().required(),
  startDate: joi.string(),
  endDate: joi.string(),
  categories: joi.string(),
}).required();

export const fetchWalletTransactions = (credentials: Credentials) => async (
  options: FetchWalletTransactionsOptions,
): Promise<FetchWalletTransactionsResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = await validateJoiSchema<FetchWalletTransactionsOptions>(getSchema(), options);

  const queryParams: FetchWalletTransactionsQueryParams = {
    ...result,
    username,
  };

  return sendRequest<FetchWalletTransactionsResponse, null, FetchWalletTransactionsQueryParams>('FETCH_WALLET_TRANSACTIONS',
    username, 'GET', null, {
      headers: {
        apiKey,
        accept: format,
        'Content-Type': 'application/json',
      },
      params: queryParams,
    });
};
