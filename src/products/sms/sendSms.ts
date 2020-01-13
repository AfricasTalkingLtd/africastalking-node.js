import joi from 'joi';
import { validateJoiSchema, sendRequest } from '../../utils/misc';
import { SmsOptions, SmsPostData, SmsResponse } from './sendSms.types';
import { Credentials } from '../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../utils/getFullCredentials';

const getSchema = (isBulk: boolean, isPremium: boolean) => {
  const schema = joi.object({
    to: joi.alternatives().try(
      joi.array().items(joi.string().regex(/^\+\d{1,3}\d{3,}$/, 'to').required()).required(),
      joi.string().regex(/^\+\d{1,3}\d{3,}$/, 'to').required(),
    ),
    message: joi.string().required(),
    from: joi.string(),
  }).required();

  if (isBulk) {
    return schema.keys({
      bulkSMSMode: joi.number().valid(0, 1).required(),
      enqueue: joi.number().valid(0, 1).required(),
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

export const sendSms = (credentials: Credentials) => async (
  options: SmsOptions, isBulk: boolean = false, isPremium: boolean = false,
): Promise<SmsResponse> => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<SmsOptions>(getSchema(isBulk, isPremium), options);

  const { to } = result;

  const data: SmsPostData = {
    username,
    ...result,
    to: Array.isArray(to) ? to.join(',') : to,
    ...(isBulk && { bulkSMSMode: 1 }),
    ...(isPremium && { bulkSMSMode: 0 }),
  };

  return sendRequest<SmsResponse, SmsPostData>({
    endpointCategory: 'SMS',
    username,
    method: 'POST',
    data,
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/json',
    },
  });
};
