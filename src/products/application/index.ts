import { fetchApplicationData } from './fetchApplicationData';
import { Credentials } from '../../utils/getFullCredentials.types';
import { showDeprecationWarning } from '../../utils/misc';

export const APPLICATION = (credentials: Credentials) => ({
  fetchApplicationData: fetchApplicationData(credentials),

  // fallbacks
  fetchAccount: (() => {
    showDeprecationWarning('APPLICATION.fetchAccount()', 'APPLICATION.fetchApplicationData()');
    return fetchApplicationData(credentials);
  })(),
});
