import joi from 'joi';
import { Credentials } from '../../../utils/getFullCredentials.types';
import {
  FetchProductTransactionsOptions, FetchProductTransactionsResponse,
  FetchProductTransactionsQueryParams, FetchProductTransactions,
} from './fetchProductTransactions.types';
import { getFullCredentials } from '../../../utils/getFullCredentials';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';
import { customRegex, CONSTANTS } from '../../../utils/constants';

const getSchema = () => joi.object({
  productName: joi.string().regex(customRegex.noSpace, 'no space').required(),
  filters: joi.object({
    pageNumber: joi.string().required(),
    count: joi.string().required(),
    startDate: joi.string(),
    endDate: joi.string(),
    category: joi.string().valid('BankCheckout', 'CardCheckout', 'MobileCheckout',
      'MobileC2B', 'MobileB2C', 'MobileB2B', 'BankTransfer', 'WalletTransfer',
      'UserStashTopup'),
    provider: joi.string().valid([...Object.values(CONSTANTS.PROVIDER), 'Segovia', 'Flutterwave', 'Admin']),
    status: joi.string().valid('Success', 'Failed'),
    source: joi.string().valid('phoneNumber', 'BankAccount', 'Card', 'Wallet'),
    destination: joi.string().valid('phoneNumber', 'BankAccount', 'Card', 'Wallet'),
    providerChannel: joi.string(),
  }).required(),
}).required();

export const fetchProductTransactions = (
  credentials: Credentials,
): FetchProductTransactions => async (options) => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<FetchProductTransactionsOptions>(getSchema(), options);

  const queryParams: FetchProductTransactionsQueryParams = {
    productName: result.productName,
    ...result.filters,
    username,
  };

  return sendRequest<FetchProductTransactionsResponse, null, FetchProductTransactionsQueryParams>({
    endpointCategory: 'FETCH_PRODUCT_TRANSACTIONS',
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
