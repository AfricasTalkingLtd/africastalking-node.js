import { Schema } from 'joi';
import axios from 'axios';
import { config } from '../constants';
import { UrlCategory } from '../constants/index.types';
import { SendRequestOptions } from './misc.types';

export const validateJoiSchema = <T>(schema: Schema, data: any): T => {
  const { error, value } = schema.validate(data);

  if (error) {
    const combinedMessages = error.details.map((d) => d.message).join(';');
    throw new Error(combinedMessages);
  }

  return value;
};

const getUrl = (urlCategory: UrlCategory, username: string): string => {
  const isSandbox = (): boolean => username.toLowerCase() === 'sandbox';
  const { urls } = config;

  return isSandbox()
    ? urls[urlCategory].sandbox
    : urls[urlCategory].live;
};

export const sendRequest = <Response, PostData = null, Params = any>(
  opts: SendRequestOptions<PostData, Params>,
): Promise<Response> => {
  const {
    urlCategory, username, method, data = null, headers, params,
  } = opts;

  return axios({
    url: getUrl(urlCategory, username),
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
