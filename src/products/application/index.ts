import { FullCredentials } from '../index.interface';
import { fetchApplicationData } from './fetchApplicationData';

export const APPLICATION = (fullCredentials: FullCredentials) => ({
  fetchApplicationData: fetchApplicationData(fullCredentials),
});
