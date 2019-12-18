import joi from 'joi';
import { Credentials } from '../../utils/getCredentials.interface';
import { TopupStashOptions, TopupStashResponse, TopupStashPostData } from './topupStash.interface';
import { getFullCredentials } from '../../utils/getCredentials';
import { validateJoiSchema, sendRequest } from '../../utils/misc';

const getSchema = () => joi.object({
  productName: joi.string().regex(/\S/, 'no space').required(),
  currencyCode: joi.string().valid('KES', 'UGX', 'USD').required(),
  amount: joi.number().required(),
  metadata: joi.object(),
}).required();

export const topupStash = (credentials: Credentials) => async (
  options: TopupStashOptions,
): Promise<TopupStashResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = await validateJoiSchema<TopupStashOptions>(getSchema(), options);

  const postData: TopupStashPostData = {
    ...result,
    username,
  };

  return sendRequest<TopupStashResponse, TopupStashPostData>('TOPUP_STASH', username, 'POST', postData, {
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/json',
    },
  });
};
