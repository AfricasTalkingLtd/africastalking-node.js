import joi from 'joi';
import { Credentials } from '../../../utils/getFullCredentials.types';
import {
  MobileB2BOptions, MobileB2BResponse, MobileB2BPostData, MobileB2B,
} from './mobileB2B.types';
import { getFullCredentials } from '../../../utils/getFullCredentials';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';
import { customRegex, CONSTANTS } from '../../../utils/constants';

const getSchema = () => joi.object({
  productName: joi.string().regex(customRegex.noSpace, 'no space').required(),
  provider: joi.string().valid([...Object.values(CONSTANTS.PROVIDER), 'TigoTanzania']).required(),
  transferType: joi.string().valid(Object.values(CONSTANTS.TRANSFER_TYPE)).required(),
  currencyCode: joi.string().valid('KES', 'UGX', 'USD').required(),
  amount: joi.number().required(),
  destinationChannel: joi.string().required(),
  destinationAccount: joi.string().required(),
  metadata: joi.object(),
}).required();

export const mobileB2B = (
  credentials: Credentials,
): MobileB2B => async (options) => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<MobileB2BOptions>(getSchema(), options);

  const data: MobileB2BPostData = {
    ...result,
    username,
  };

  return sendRequest<MobileB2BResponse, MobileB2BPostData>({
    endpointCategory: 'MOBILE_B2B',
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
