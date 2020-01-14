import { sendRequest } from '../../utils/misc';
import { ApplicationResponse, ApplicationQueryParams, FetchApplicationData } from './fetchApplicationData.types';
import { Credentials } from '../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../utils/getFullCredentials';

export const fetchApplicationData = (
  credentials: Credentials,
): FetchApplicationData => async () => {
  const { apiKey, username, format } = getFullCredentials(credentials);

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
