import { Airtime } from './airtime/index.types';
import { Application } from './application/index.types';
import { Payments } from './payments/index.types';
import { Sms } from './sms/index.types';
import { Token } from './token/index.types';
import { Voice } from './voice/index.types';
import { Ussd } from './ussd/index.types';
export interface AFRICASTALKING {
    AIRTIME: Airtime;
    APPLICATION: Application;
    PAYMENTS: Payments;
    SMS: Sms;
    TOKEN: Token;
    VOICE: Voice;
    USSD: Ussd;
    ACCOUNT: Application;
    PAYMENT: Payments;
}
