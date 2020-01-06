import { FetchMessagesResponse, FetchMessagesOptions, FetchMessagesQueryParams } from './fetchMessages.d';
import { sendRequest } from '../../utils/misc';
import { getFullCredentials } from '../../utils/getFullCredentials';
import { Credentials } from '../../utils/getFullCredentials.d';

export const fetchMessages = (credentials: Credentials) => async (
  options: FetchMessagesOptions,
): Promise<FetchMessagesResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);

  const queryParams: FetchMessagesQueryParams = {
    username,
    lastReceivedId: options.lastReceivedId || '0',
  };

  return sendRequest<FetchMessagesResponse, null, FetchMessagesQueryParams>({
    urlCategory: 'SMS',
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
