import { FullCredentials } from '../index.interface';
import { FetchMessagesResponse, FetchMessagesOptions } from './fetchMessages.interface';
import { sendRequest } from '../../utils/misc';

export const fetchMessages = (fullCredentials: FullCredentials) => async (
  options: FetchMessagesOptions,
): Promise<FetchMessagesResponse> => {
  const { apiKey, username, format } = fullCredentials;

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
