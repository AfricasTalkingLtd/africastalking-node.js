import { sendRequest } from '../../utils/misc';
import { ApplicationResponse, ApplicationQueryParams } from './fetchApplicationData.interface';
import { Credentials } from '../../utils/getCredentials.interface';
import { getFullCredentials } from '../../utils/getCredentials';

export const fetchApplicationData = (
  credentials: Credentials,
) => async (): Promise<ApplicationResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);

  const queryParams: ApplicationQueryParams = { username };

  return sendRequest<ApplicationResponse, null, ApplicationQueryParams>('APPLICATION', username, 'GET', null, {
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/json',
    },
    params: queryParams,
  });
};
