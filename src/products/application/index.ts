import { fetchApplicationData } from './fetchApplicationData';
import { Credentials } from '../../utils/getCredentials.interface';

export const APPLICATION = (credentials: Credentials) => ({
  fetchApplicationData: fetchApplicationData(credentials),
});
