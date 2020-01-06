import { Credentials } from '../../../utils/getFullCredentials.d';
import { FetchWalletBalanceResponse, FetchWalletBalanceQueryParams } from './fetchWalletBalance.d';
import { getFullCredentials } from '../../../utils/getFullCredentials';
import { sendRequest } from '../../../utils/misc';

export const fetchWalletBalance = (
  credentials: Credentials,
) => async (): Promise<FetchWalletBalanceResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);

  const queryParams: FetchWalletBalanceQueryParams = { username };

  return sendRequest<FetchWalletBalanceResponse, null, FetchWalletBalanceQueryParams>({
    urlCategory: 'FETCH_WALLET_BALANCE',
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
