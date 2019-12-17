import joi from 'joi';
import { validateJoiSchema, sendRequest } from '../../utils/misc';
import { SmsOptions, SmsPostData, SmsResponse } from './sendSms.interface';
import { FullCredentials } from '../index.interface';

const getSchema = (isBulk: boolean, isPremium: boolean) => {
  const schema = joi.object({
    to: joi.alternatives().try(
      joi.array().items((joi.string() as any).pattern(/^\+\d{1,3}\d{3,}$/).required()).required(),
      (joi.string() as any).pattern(/^\+\d{1,3}\d{3,}$/).required(),
    ),
    message: joi.string().required(),
    from: joi.string(),
  });

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

export const sendSms = (fullCredentials: FullCredentials) => async (
  options: SmsOptions, isBulk: boolean = false, isPremium: boolean = false,
): Promise<SmsResponse> => {
  const result = await validateJoiSchema<SmsOptions>(getSchema(isBulk, isPremium), options);

  const { to } = result;
  const { apiKey, username, format } = fullCredentials;

  const postData: SmsPostData = {
    username,
    ...result,
    to: Array.isArray(to) ? to.join(',') : to,
    ...(isBulk && { bulkSMSMode: 1 }),
    ...(isPremium && { bulkSMSMode: 0 }),
  };

  return sendRequest<SmsResponse, SmsPostData>('SMS', username, 'POST', postData, {
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/json',
    },
  });
};
