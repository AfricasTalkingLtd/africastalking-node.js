import { sendRequest } from '../../utils/misc';
import { ApplicationResponse, ApplicationQueryParams } from './fetchApplicationData.types';
import { Credentials } from '../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../utils/getFullCredentials';

export const fetchApplicationData = (
  credentials: Credentials,
) => async (): Promise<ApplicationResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);

  const queryParams: ApplicationQueryParams = { username };

  return sendRequest<ApplicationResponse, null, ApplicationQueryParams>({
    endpointCategory: 'APPLICATION',
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
