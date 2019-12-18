import { sendRequest } from '../../utils/misc';
import { ApplicationResponse } from './fetchApplicationData.interface';
import { Credentials } from '../../utils/getCredentials.interface';
import { getFullCredentials } from '../../utils/getCredentials';

export const fetchApplicationData = (
  credentials: Credentials,
) => async (): Promise<ApplicationResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);

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
