import { sendRequest } from '../../utils/misc';
import { ApplicationResponse, ApplicationQueryParams } from './fetchApplicationData.d';
import { Credentials } from '../../utils/getFullCredentials.d';
import { getFullCredentials } from '../../utils/getFullCredentials';

export const fetchApplicationData = (
  credentials: Credentials,
) => async (): Promise<ApplicationResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);

  const queryParams: ApplicationQueryParams = { username };

  return sendRequest<ApplicationResponse, null, ApplicationQueryParams>({
    urlCategory: 'APPLICATION',
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
