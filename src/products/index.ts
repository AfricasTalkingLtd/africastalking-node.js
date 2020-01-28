import { Credentials } from '../utils/index.types';
import * as airtime from './airtime';
import * as application from './application';
import * as payments from './payments';
import * as sms from './sms';
import * as token from './token';
import * as voice from './voice';
import AFRICASTALKING from './index.types';

export const AfricasTalking = (credentials: Credentials): AFRICASTALKING => Object.entries({
  ...airtime,
  ...application,
  ...payments,
  ...sms,
  ...token,
  ...voice,
}).reduce((acc, [key, value]) => ({
  ...acc,
  [key]: value(credentials),
}), {} as AFRICASTALKING);
