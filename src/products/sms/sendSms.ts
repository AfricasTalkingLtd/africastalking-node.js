import joi from 'joi';
import queryString from 'query-string';
import { validateJoiSchema, sendRequest } from '../../utils/misc';
import {
  SmsOptions, SmsPostData, SmsResponse, SendMessageComplex, SendMessage,
} from './sendSms.types';
import { Credentials } from '../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../utils/getFullCredentials';
import { customRegex } from '../../utils/constants';

const getSchema = (isBulk: boolean, isPremium: boolean) => {
  const schema = joi.object({
    to: joi.alternatives().try(
      joi.array().items(joi.string().regex(customRegex.phoneNumber, 'to').required()).required(),
      joi.string().regex(customRegex.phoneNumber, 'to').required(),
    ),
    message: joi.string().required(),
    from: joi.string(),
    enqueue: joi.boolean(),
  }).required();

  if (isBulk) {
    return schema.keys({
      bulkSMSMode: joi.boolean().required(),
    });
  }

  if (isPremium) {
    return schema.keys({
      keyword: joi.string().required(),
      linkId: joi.string(),
      retryDurationInHours: joi.number(),
    });
  }

  return schema;
};

const sendMessage = (
  credentials: Credentials,
): SendMessageComplex => async (options, isBulk = false, isPremium = false) => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<SmsOptions>(getSchema(isBulk, isPremium), options);

  const { to } = result;

  const bulkSMSMode = {
    ...(isBulk && { bulkSMSMode: true }),
    ...(isPremium && { bulkSMSMode: false }),
  };

  const data: SmsPostData = {
    username,
    ...result,
    to: Array.isArray(to) ? to.join(',') : to,
    enqueue: result.enqueue ? 1 : 0,
    bulkSMSMode: bulkSMSMode ? 1 : 0,
  };

  return sendRequest<SmsResponse, string>({
    endpointCategory: 'SMS',
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

export const sendSms = (credentials: Credentials): SendMessage => (
  opts: SmsOptions,
) => sendMessage(credentials)(opts);

export const sendBulk = (credentials: Credentials): SendMessage => (
  opts: SmsOptions,
) => sendMessage(credentials)(opts, true);

export const sendPremium = (credentials: Credentials): SendMessage => (
  opts: SmsOptions,
) => sendMessage(credentials)(opts, false, true);
