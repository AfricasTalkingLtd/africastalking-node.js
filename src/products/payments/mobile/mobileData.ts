import joi from 'joi';
import { Credentials } from '../../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../../utils/getFullCredentials';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';
import {
  MobileDataOptions, MobileDataPostData, MobileDataResponse, MobileData,
} from './mobileData.types';
import { customRegex } from '../../../utils/constants';

const getSchema = () => joi.object({
  productName: joi.string().regex(customRegex.noSpace, 'no space').required(),
  recipients: joi.array().items(
    joi.object({
      phoneNumber: joi.string().regex(customRegex.phoneNumber, 'phone number').required(),
      quantity: joi.number().required(),
      unit: joi.string().valid('MB', 'GB').required(),
      validity: joi.string().valid('Day', 'Month', 'Week').required(),
      metadata: joi.object(),
    }).required(),
  ).min(1).max(10)
    .required(),
}).required();

export const mobileData = (
  credentials: Credentials,
): MobileData => async (options) => {
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
