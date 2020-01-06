import { fetchApplicationData } from './fetchApplicationData';
import { Credentials } from '../../utils/getFullCredentials.types';

export const APPLICATION = (credentials: Credentials) => ({
  fetchApplicationData: fetchApplicationData(credentials),

  // fallbacks
  fetchAccount: fetchApplicationData(credentials),
});
