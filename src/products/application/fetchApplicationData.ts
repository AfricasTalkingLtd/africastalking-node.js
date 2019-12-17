import { FullCredentials } from '../index.interface';
import { sendRequest } from '../../utils/misc';
import { ApplicationResponse } from './fetchApplicationData.interface';

export const fetchApplicationData = (
  fullCredentials: FullCredentials,
) => (): Promise<ApplicationResponse> => {
  const { apiKey, username, format } = fullCredentials;

  return sendRequest<ApplicationResponse, null>('APPLICATION', username, 'GET', null, {
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/json',
    },
    params: {
      username,
    },
  });
};
