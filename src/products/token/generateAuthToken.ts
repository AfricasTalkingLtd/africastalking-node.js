import { Credentials } from '../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../utils/getFullCredentials';
import { GenerateAuthTokenResponse } from './generateAuthToken.types';
import { sendRequest } from '../../utils/misc';

export const generateAuthToken = (
  credentials: Credentials,
) => async (): Promise<GenerateAuthTokenResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);

  return sendRequest<GenerateAuthTokenResponse>({
    urlCategory: 'GENERATE_AUTH_TOKEN',
    username,
    method: 'GET',
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/json',
    },
  })
    .then((result) => {
      if (result.token == null || result.token === 'None') {
        return Promise.reject(result.description);
      }

      return Promise.resolve(result);
    });
};
