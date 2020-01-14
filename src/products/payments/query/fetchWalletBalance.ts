import { Credentials } from '../../../utils/getFullCredentials.types';
import { FetchWalletBalanceResponse, FetchWalletBalanceQueryParams, FetchWalletBalance } from './fetchWalletBalance.types';
import { getFullCredentials } from '../../../utils/getFullCredentials';
import { sendRequest } from '../../../utils/misc';

export const fetchWalletBalance = (
  credentials: Credentials,
): FetchWalletBalance => async () => {
  const { apiKey, username, format } = getFullCredentials(credentials);

  const queryParams: FetchWalletBalanceQueryParams = { username };

  return sendRequest<FetchWalletBalanceResponse, null, FetchWalletBalanceQueryParams>({
    endpointCategory: 'FETCH_WALLET_BALANCE',
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
