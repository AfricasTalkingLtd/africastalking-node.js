import { fetchApplicationData } from './fetchApplicationData';
import { Credentials } from '../../utils/getFullCredentials.d';

export const APPLICATION = (credentials: Credentials) => ({
  fetchApplicationData: fetchApplicationData(credentials),

  // fallbacks
  fetchAccount: fetchApplicationData(credentials),
});
