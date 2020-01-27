import { Airtime } from './index.types';
import { Credentials } from '../../utils/getFullCredentials.types';
import { sendAirtimeRequest } from './sendAirtimeRequest';
import { showDeprecationWarning } from '../../utils/misc';

// exports 1: types
export { SendAirtimeOptions, SendAirtimeResponse } from './sendAirtimeRequest.types';

// exports 2: pure functions
export { sendAirtimeRequest } from './sendAirtimeRequest';

// exports 3: instance-based functions
export const AIRTIME = (credentials: Credentials): Airtime => ({
  sendAirtimeRequest: sendAirtimeRequest(credentials),

  get send() {
    showDeprecationWarning('AIRTIME.send()', 'AIRTIME.sendAirtimeRequest()', 'minor');
    return sendAirtimeRequest(credentials);
  },
});
