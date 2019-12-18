import { FetchMessagesResponse, FetchMessagesOptions, FetchMessagesQueryParams } from './fetchMessages.interface';
import { sendRequest } from '../../utils/misc';
import { getFullCredentials } from '../../utils/getCredentials';
import { Credentials } from '../../utils/getCredentials.interface';

export const fetchMessages = (credentials: Credentials) => async (
  options: FetchMessagesOptions,
): Promise<FetchMessagesResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);

  const queryParams: FetchMessagesQueryParams = {
    username,
    lastReceivedId: options.lastReceivedId || '0',
  };

  return sendRequest<FetchMessagesResponse, null, FetchMessagesQueryParams>('SMS', username, 'GET', null, {
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/json',
    },
    params: queryParams,
  });
};
