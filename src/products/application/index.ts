import { Application } from './index.types';
import { Credentials } from '../../utils/getFullCredentials.types';
import { fetchApplicationData } from './fetchApplicationData';
import { showDeprecationWarning } from '../../utils/misc';

// exports 1: types
export { FetchApplicationDataResponse } from './fetchApplicationData.types';

// exports 2: pure functions
export { fetchApplicationData } from './fetchApplicationData';

// exports 3: instance-based functions
export const APPLICATION = (credentials: Credentials): Application => ({
  fetchApplicationData: fetchApplicationData(credentials),

  get fetchAccount() {
    showDeprecationWarning('APPLICATION.fetchAccount()', 'APPLICATION.fetchApplicationData()', 'minor');
    return fetchApplicationData(credentials);
  },
});
