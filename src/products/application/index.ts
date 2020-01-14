import { Application } from './index.types';
import { Credentials } from '../../utils/getFullCredentials.types';
import { fetchApplicationData } from './fetchApplicationData';
import { showDeprecationWarning } from '../../utils/misc';

export const application = (credentials: Credentials): Application => ({
  fetchApplicationData: fetchApplicationData(credentials),

  // fallbacks
  fetchAccount: () => {
    showDeprecationWarning('APPLICATION.fetchAccount()', 'APPLICATION.fetchApplicationData()', 'minor');
    return fetchApplicationData(credentials)();
  },
});
