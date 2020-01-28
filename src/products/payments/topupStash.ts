import joi from 'joi';
import { Credentials } from '../../utils/getFullCredentials.types';
import {
  TopupStashOptions, TopupStashResponse, TopupStashPostData, TopupStash,
} from './topupStash.types';
import { getFullCredentials } from '../../utils/getFullCredentials';
import { validateJoiSchema, sendRequest } from '../../utils/misc';
import { customRegex } from '../../utils/constants';

const getSchema = () => joi.object({
  productName: joi.string().regex(customRegex.noSpace, 'no space').required(),
  currencyCode: joi.string().valid('KES', 'UGX', 'USD').required(),
  amount: joi.number().required(),
  metadata: joi.object(),
}).required();

export const topupStash = (
  credentials: Credentials,
): TopupStash => async (options) => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<TopupStashOptions>(getSchema(), options);

  const data: TopupStashPostData = {
    ...result,
    username,
  };

  return sendRequest<TopupStashResponse, TopupStashPostData>({
    endpointCategory: 'TOPUP_STASH',
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
