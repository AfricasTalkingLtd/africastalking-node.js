import joi from 'joi';
import { Credentials, FullCredentials } from './getFullCredentials.types';
import { validateJoiSchema } from './misc';

const getSchema = () => joi.object({
  apiKey: joi.string().required(),
  username: joi.string().required(),
  format: joi.string().valid('json', 'xml'),
}).required();

export const getFullCredentials = (credentials: Credentials): FullCredentials => {
  const value = validateJoiSchema<Credentials>(getSchema(), credentials);

  return {
    ...value,
    format: value?.format === 'xml' ? 'application/xml' : 'application/json',
  };
};
