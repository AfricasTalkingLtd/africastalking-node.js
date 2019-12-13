import CONFIG from 'config';
import { Config } from './index.interface';

export const config: Config = {
  apiUrl: CONFIG.get('apiUrl'),
  currencyCodes: CONFIG.get('currencyCodes'),
};
