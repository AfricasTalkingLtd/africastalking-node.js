import joi from 'joi';
import queryString from 'query-string';
import {
  SendAirtimeOptions, SendAirtimePostData, SendAirtimeResponse, SendAirtimeRequest,
} from './sendAirtimeRequest.types';
import { validateJoiSchema, sendRequest } from '../../utils/misc';
import { Credentials } from '../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../utils/getFullCredentials';
import { customRegex } from '../../utils/constants';

const getSchema = () => joi.object({
  recipients: joi.array().items(
    joi.object({
      phoneNumber: joi.string().regex(customRegex.phoneNumber, 'phone number').required(),
      currencyCode: joi.string().valid('KES', 'UGX', 'TZS', 'NGN').required(),
      amount: joi.number().required(),
    }).required(),
  ).min(1).required(),
}).required();

export const sendAirtimeRequest = (
  credentials: Credentials,
): SendAirtimeRequest => async (options) => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<SendAirtimeOptions>(getSchema(), options);

  const data: SendAirtimePostData = {
    username,
    recipients: JSON.stringify(result.recipients.map((r) => ({
      phoneNumber: r.phoneNumber,
      amount: `${r.currencyCode} ${r.amount}`,
    }))) as any,
  };

  return sendRequest<SendAirtimeResponse, string>({
    endpointCategory: 'AIRTIME',
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
