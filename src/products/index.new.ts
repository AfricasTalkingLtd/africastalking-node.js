import { Credentials } from '../utils/index.types';
import * as airtime from './airtime';
import * as application from './application';
import * as payments from './payments';
import * as sms from './sms';
import * as token from './token';
import * as voice from './voice';

export const AT = (credentials: Credentials) => Object.entries({
  ...airtime,
  ...application,
  ...payments,
  ...sms,
  ...token,
  ...voice,
}).reduce((_acc, [key, value]) => ({
  [key]: value(credentials),
}), {});
