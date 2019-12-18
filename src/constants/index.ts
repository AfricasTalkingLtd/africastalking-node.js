import CONFIG from 'config';
import { Config } from './index.interface';

export const config: Config = {
  urls: CONFIG.get('urls'),
};
