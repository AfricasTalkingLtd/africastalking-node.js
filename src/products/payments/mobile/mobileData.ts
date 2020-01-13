import joi from 'joi';
import { Credentials } from '../../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../../utils/getFullCredentials';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';
import { MobileDataOptions, MobileDataPostData, MobileDataResponse } from './mobileData.types';

const getSchema = () => joi.object({
  productName: joi.string().regex(/\S/, 'no space').required(),
  recipients: joi.array().items(
    joi.object({
      phoneNumber: joi.string().regex(/^\+\d{1,3}\d{3,}$/, 'phone number').required(),
      quantity: joi.number().required(),
      unit: joi.string().valid('MB', 'GB').required(),
      validity: joi.string().valid('Day', 'Month', 'Week').required(),
      metadata: joi.object(),
    }).required(),
  ).min(1).max(10)
    .required(),
}).required();

export const mobileData = (credentials: Credentials) => async (
  options: MobileDataOptions,
): Promise<MobileDataResponse> => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<MobileDataOptions>(getSchema(), options);

  const data: MobileDataPostData = {
    ...result,
    username,
  };

  return sendRequest<MobileDataResponse, MobileDataPostData>({
    endpointCategory: 'MOBILE_DATA',
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
