import joi from 'joi';
import { Credentials } from '../../../utils/getFullCredentials.types';
import { FetchProductTransactionsOptions, FetchProductTransactionsResponse, FetchProductTransactionsQueryParams } from './fetchProductTransactions.types';
import { getFullCredentials } from '../../../utils/getFullCredentials';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';

const getSchema = () => joi.object({
  productName: joi.string().regex(/\S/, 'no space').required(),
  pageNumber: joi.string().required(),
  count: joi.string().required(),
  startDate: joi.string(),
  endDate: joi.string(),
  category: joi.string().valid('BankCheckout', 'CardCheckout', 'MobileCheckout',
    'MobileC2B', 'MobileB2C', 'MobileB2B', 'BankTransfer', 'WalletTransfer',
    'UserStashTopup'),
  provider: joi.string().valid('Mpesa', 'Segovia', 'Flutterwave', 'Admin', 'Athena'),
  status: joi.string().valid('Success', 'Failed'),
  source: joi.string().valid('phoneNumber', 'BankAccount', 'Card', 'Wallet'),
  destination: joi.string().valid('phoneNumber', 'BankAccount', 'Card', 'Wallet'),
  providerChannel: joi.string(),
}).required();

export const fetchProductTransactions = (credentials: Credentials) => async (
  options: FetchProductTransactionsOptions,
): Promise<FetchProductTransactionsResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = validateJoiSchema<FetchProductTransactionsOptions>(getSchema(), options);

  const queryParams: FetchProductTransactionsQueryParams = {
    ...result,
    username,
  };

  return sendRequest<FetchProductTransactionsResponse, null, FetchProductTransactionsQueryParams>({
    urlCategory: 'FETCH_PRODUCT_TRANSACTIONS',
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
