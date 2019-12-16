import Joi from 'joi';
import { Credentials, FullCredentials } from './index.interface';
import { SMS } from './sms';
import { APPLICATION } from './application';
import { AIRTIME } from './airtime';

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
  const { format } = value;

  const fullCredentials: FullCredentials = {
    ...value,
    format: format === 'json' ? 'application/json' : 'application/xml',
  };

  return {
    AIRTIME: AIRTIME(fullCredentials),
    APPLICATION: APPLICATION(fullCredentials),
    SMS: SMS(fullCredentials),
    // VOICE,
    // PAYMENTS,
    // TOKEN,
    // USSD,

    // fallbacks
    ACCOUNT: APPLICATION(fullCredentials),
    // PAYMENT,
    // end fallbacks
  };
};
