import { Credentials } from '../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../utils/getFullCredentials';
import { GenerateAuthTokenResponse, GenerateAuthTokenPostData, GenerateAuthToken } from './generateAuthToken.types';
import { sendRequest } from '../../utils/misc';

export const generateAuthToken = (
  credentials: Credentials,
): GenerateAuthToken => async () => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const data: GenerateAuthTokenPostData = { username };

  return sendRequest<GenerateAuthTokenResponse, {}>({
    endpointCategory: 'GENERATE_AUTH_TOKEN',
    username,
    method: 'POST',
    data,
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
