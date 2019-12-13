import Joi from 'joi';
import axios from 'axios';
import queryString from 'query-string';
import { AirtimeOptions, PostData } from './airtime.interface';
import { config } from '../constants';
import { FullCredentials, Format } from './index.interface';

const validate = async (options: AirtimeOptions): Promise<AirtimeOptions> => {
  const { currencyCodes } = config;

  const schema = Joi.object({
    recipients: Joi.array().items(
      Joi.object({
        phoneNumber: Joi.string().required().pattern(/^\+\d{1,3}\d{3,}$/),
        currencyCode: Joi.string().valid(currencyCodes.join(', ')).required(),
        amount: Joi.number().required(),
      }),
    ).min(1).required(),
  }).required();

  const { error, value } = schema.validate(options);

  if (error) {
    const combinedMessages = error.details.map((d) => d.message).join(';');
    return Promise.reject(new Error(combinedMessages));
  }

  return Promise.resolve(value);
};

const sendRequest = (
  apiKey: string, isSandbox: boolean, format: Format, data: any,
): Promise<any> => {
  const { apiUrl: { AIRTIME } } = config;
  const url = isSandbox ? AIRTIME.sandbox : AIRTIME.live;

  return axios.post(url, queryString.stringify(data), {
    headers: {
      apiKey,
      'Content-Type': 'application/x-www-form-urlencoded',
      accept: format,
    },
  }).then((value) => {
    if (value.status !== 201) {
      return Promise.reject(value.data);
    }

    return Promise.resolve(value.data);
  });
};

export const sendAirtimeRequest = async (
  credentials: FullCredentials, options: AirtimeOptions,
): Promise<any> => {
  const result = await validate(options);

  const { recipients: rawRecipients } = result;
  const {
    apiKey, username, format, isSandbox,
  } = credentials;

  const postData: PostData = {
    username,
    recipients: rawRecipients.map((r) => ({
      phoneNumber: r.phoneNumber,
      amount: `${r.currencyCode} ${r.amount}`,
    })),
  };

  return sendRequest(apiKey, isSandbox, format, postData);
};
