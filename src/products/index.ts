import Joi from 'joi';
import { Credentials, FullCredentials } from './index.interface';
import { sendAirtimeRequest } from './airtime';
import { AirtimeOptions } from './airtime.interface';
import { fetchApplicationData } from './application';

const validate = (credentials: Credentials): Credentials => {
  const schema = Joi.object({
    apiKey: Joi.string().required(),
    username: Joi.string().required(),
    format: Joi.string().valid('json', 'xml').required(),
  }).required();

  const { error, value } = schema.validate(credentials);

  if (error) {
    const combinedMessages = error.details.map((d) => d.message).join(';');
    throw new Error(combinedMessages);
  }

  return value;
};

export const AfricasTalking = (credentials: Credentials) => {
  const value = validate(credentials);
  const { format, username } = value;

  const fullCredentials: FullCredentials = {
    ...value,
    format: format === 'json' ? 'application/json' : 'application/xml',
    isSandbox: username.toLowerCase() === 'sandbox',
  };

  return {
    AIRTIME: {
      send: (options: AirtimeOptions) => sendAirtimeRequest(fullCredentials, options),
    },
    APPLICATION: {
      fetchApplicationData: () => fetchApplicationData(fullCredentials),
    },
    ACCOUNT: {
      fetchApplicationData: () => fetchApplicationData(fullCredentials),
    },
  };
};
