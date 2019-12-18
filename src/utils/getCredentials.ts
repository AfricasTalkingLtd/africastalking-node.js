import joi from 'joi';
import { Credentials, FullCredentials } from './getCredentials.interface';
import { validateJoiSchema } from './misc';

const getSchema = () => joi.object({
  apiKey: joi.string().required(),
  username: joi.string().required(),
  format: joi.string().valid('json', 'xml').required(),
}).required();

export const getFullCredentials = async (credentials: Credentials): Promise<FullCredentials> => {
  const value = await validateJoiSchema<Credentials>(getSchema(), credentials);

  return {
    ...value,
    format: value.format === 'xml' ? 'application/xml' : 'application/json',
  };
};
