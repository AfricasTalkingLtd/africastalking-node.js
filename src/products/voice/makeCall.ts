import joi from 'joi';
import queryString from 'query-string';
import { Credentials } from '../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../utils/getFullCredentials';
import { sendRequest, validateJoiSchema } from '../../utils/misc';
import {
  MakeCallResponse, MakeCallOptions, MakeCallPostData, MakeCall,
} from './makeCall.types';
import { customRegex } from '../../utils/constants';

const getSchema = () => joi.object({
  callTo: joi.string().regex(customRegex.phoneNumber, 'phone number').required(),
  callFrom: joi.string().required(),
  clientRequestId: joi.string(),
}).required();

export const makeCall = (
  credentials: Credentials,
): MakeCall => async (options) => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<MakeCallOptions>(getSchema(), options);

  const data: MakeCallPostData = {
    username,
    to: result.callTo,
    from: result.callFrom,
    clientRequestId: result.clientRequestId,
  };

  return sendRequest<MakeCallResponse, string>({
    endpointCategory: 'MAKE_CALL',
    username,
    method: 'POST',
    data: queryString.stringify(data),
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};
