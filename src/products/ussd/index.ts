import { expressHandler } from './expressHandler';
import { Ussd } from './index.types';

// exports 1: types
export { ExpressHandler } from './expressHandler.types';

// exports 2: pure functions
export { expressHandler } from './expressHandler';

// exports 3: instance-based functions
export const USSD: Ussd = expressHandler;
