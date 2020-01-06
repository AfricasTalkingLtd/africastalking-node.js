import CONFIG from 'config';
import { Config } from './index.types';

export const config: Config = {
  urls: CONFIG.get('urls'),
};
