import joi from 'joi';
import queryString from 'query-string';
import { AirtimeOptions, AirtimePostData, AirtimeResponse } from './sendAirtimeRequest.interface';
import { validateJoiSchema, sendRequest } from '../../utils/misc';
import { Credentials } from '../../utils/getCredentials.interface';
import { getFullCredentials } from '../../utils/getCredentials';

const getSchema = () => joi.object({
  recipients: joi.array().items(
    joi.object({
      phoneNumber: joi.string().regex(/^\+\d{1,3}\d{3,}$/, 'phone number').required(),
      currencyCode: joi.string().valid(['KES', 'UGX', 'TZS', 'NGN']).required(),
      amount: joi.number().required(),
    }).required(),
  ).min(1).required(),
}).required();

export const sendAirtimeRequest = (credentials: Credentials) => async (
  options: AirtimeOptions,
): Promise<AirtimeResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = await validateJoiSchema<AirtimeOptions>(getSchema(), options);

  const postData: AirtimePostData = {
    username,
    recipients: result.recipients.map((r) => ({
      phoneNumber: r.phoneNumber,
      amount: `${r.currencyCode} ${r.amount}`,
    })),
  };

  return sendRequest<AirtimeResponse, string>('AIRTIME', username, 'POST', queryString.stringify(postData), {
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};
