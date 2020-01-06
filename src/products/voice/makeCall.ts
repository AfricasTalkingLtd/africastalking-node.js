import joi from 'joi';
import queryString from 'query-string';
import { Credentials } from '../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../utils/getFullCredentials';
import { sendRequest, validateJoiSchema } from '../../utils/misc';
import { MakeCallResponse, MakeCallOptions, MakeCallPostData } from './makeCall.types';

const getSchema = () => joi.object({
  callTo: joi.string().regex(/^\+\d{1,3}\d{3,}$/, 'phone number').required(),
  callFrom: joi.string().required(),
  clientRequestId: joi.string(),
}).schema();

export const makeCall = (credentials: Credentials) => async (
  options: MakeCallOptions,
): Promise<MakeCallResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = await validateJoiSchema<MakeCallOptions>(getSchema(), options);

  const data: MakeCallPostData = {
    username,
    to: result.callTo,
    from: result.callFrom,
    clientRequestId: result.clientRequestId,
  };

  return sendRequest<MakeCallResponse, string>({
    urlCategory: 'MAKE_CALL',
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
