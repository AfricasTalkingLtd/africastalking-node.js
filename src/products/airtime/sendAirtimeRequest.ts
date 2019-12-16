import joi from 'joi';
import queryString from 'query-string';
import { AirtimeOptions, AirtimePostData, AirtimeResponse } from './sendAirtimeRequest.interface';
import { config } from '../../constants';
import { FullCredentials } from '../index.interface';
import { validateJoiSchema, sendRequest } from '../../utils/misc';

const getSchema = () => {
  const { currencyCodes } = config;

  return joi.object({
    recipients: joi.array().items(
      joi.object({
        phoneNumber: (joi.string() as any).pattern(/^\+\d{1,3}\d{3,}$/).required(),
        currencyCode: joi.string().valid(currencyCodes.join(', ')).required(),
        amount: joi.number().required(),
      }),
    ).min(1).required(),
  }).required();
};

export const sendAirtimeRequest = async (
  fullCredentials: FullCredentials, options: AirtimeOptions,
): Promise<AirtimeResponse> => {
  const result = await validateJoiSchema<AirtimeOptions>(getSchema(), options);

  const { recipients: rawRecipients } = result;
  const { apiKey, username, format } = fullCredentials;

  const postData: AirtimePostData = {
    username,
    recipients: rawRecipients.map((r) => ({
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
