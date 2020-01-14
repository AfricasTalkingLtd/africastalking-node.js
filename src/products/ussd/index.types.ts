import { UssdHandler, ExpressHandler } from './expressHandler.types';

export type Ussd = (handler: UssdHandler) => ExpressHandler[];
