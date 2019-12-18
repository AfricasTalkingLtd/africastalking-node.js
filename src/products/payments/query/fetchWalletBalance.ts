import { Credentials } from '../../../utils/getCredentials.interface';
import { FetchWalletBalanceResponse, FetchWalletBalanceQueryParams } from './fetchWalletBalance.interface';
import { getFullCredentials } from '../../../utils/getCredentials';
import { sendRequest } from '../../../utils/misc';

export const fetchWalletBalance = (
  credentials: Credentials,
) => async (): Promise<FetchWalletBalanceResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);

  const queryParams: FetchWalletBalanceQueryParams = { username };

  return sendRequest<FetchWalletBalanceResponse, null, FetchWalletBalanceQueryParams>('FETCH_WALLET_BALANCE',
    username, 'GET', null, {
      headers: {
        apiKey,
        accept: format,
        'Content-Type': 'application/json',
      },
      params: queryParams,
    });
};
