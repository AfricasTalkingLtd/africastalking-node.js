import { FetchMessagesResponse, FetchMessagesOptions } from './fetchMessages.interface';
import { sendRequest } from '../../utils/misc';
import { getFullCredentials } from '../../utils/getCredentials';
import { Credentials } from '../../utils/getCredentials.interface';

export const fetchMessages = (credentials: Credentials) => async (
  options: FetchMessagesOptions,
): Promise<FetchMessagesResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);

  return sendRequest<FetchMessagesResponse, null>('SMS', username, 'GET', null, {
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/json',
    },
    params: {
      username,
      lastReceivedId: options.lastReceivedId || 0,
    },
  });
};
