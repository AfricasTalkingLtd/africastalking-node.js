import { Schema } from 'joi';
import axios from 'axios';
import { SendRequestOptions } from './misc.types';
import { getUrl } from './getUrl';

export const validateJoiSchema = <T>(schema: Schema, data: any): T => {
  const { error, value } = schema.validate(data);

  if (error) {
    const combinedMessages = error.details.map((d) => d.message).join(';');
    throw new Error(combinedMessages);
  }

  return value;
};

export const sendRequest = <Response, PostData = null, Params = any>(
  opts: SendRequestOptions<PostData, Params>,
): Promise<Response> => {
  const {
    endpointCategory, username, method, data = null, headers, params,
  } = opts;

  return axios({
    url: getUrl(endpointCategory, username),
    method,
    data,
    headers,
    params,
  }).then((value) => {
    if (![200, 201].includes(value.status)) {
      return Promise.reject(value.data);
    }

    return Promise.resolve(value.data);
  });
};
