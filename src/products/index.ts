import { Credentials } from '../utils/index.types';
import * as airtime from './airtime';
import * as application from './application';
import * as payments from './payments';
import * as sms from './sms';
import * as token from './token';
import * as voice from './voice';
import AFRICASTALKING from './index.types';

// convert function into class-like to allow instantiation
// https://stackoverflow.com/questions/43623461/new-expression-whose-target-lacks-a-construct-signature-in-typescript/43624326#43624326

export const Client = function Client(credentials: Credentials): AFRICASTALKING {
  return Object.entries({
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
} as any as { new(credentials: Credentials): AFRICASTALKING };
