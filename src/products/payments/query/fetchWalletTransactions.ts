import joi from 'joi';
import { Credentials } from '../../../utils/getFullCredentials.types';
import {
  FetchWalletTransactionsOptions, FetchWalletTransactionsResponse,
  FetchWalletTransactionsQueryParams, FetchWalletTransactions,
} from './fetchWalletTransactions.types';
import { getFullCredentials } from '../../../utils/getFullCredentials';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';

const getSchema = () => joi.object({
  filters: joi.object({
    pageNumber: joi.string().required(),
    count: joi.string().required(),
    startDate: joi.string(),
    endDate: joi.string(),
    categories: joi.string(),
  }).required(),
}).required();

export const fetchWalletTransactions = (
  credentials: Credentials,
): FetchWalletTransactions => async (options) => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<FetchWalletTransactionsOptions>(getSchema(), options);

  const queryParams: FetchWalletTransactionsQueryParams = {
    ...result.filters,
    username,
  };

  return sendRequest<FetchWalletTransactionsResponse, null, FetchWalletTransactionsQueryParams>({
    endpointCategory: 'FETCH_WALLET_TRANSACTIONS',
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
