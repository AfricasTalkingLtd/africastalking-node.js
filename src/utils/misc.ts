import { Schema } from 'joi';
import axios from 'axios';
import { config } from '../constants';
import { UrlCategory } from '../constants/index.interface';

export const validateJoiSchema = <T>(
  schema: Schema, data: any,
): Promise<T> => new Promise((resolve, reject) => {
    const { error, value } = schema.validate(data);

    if (error) {
      const combinedMessages = error.details.map((d) => d.message).join(';');
      reject(new Error(combinedMessages));
      return;
    }

    resolve(value);
  });

export const sendRequest = <T1, T2>(
  urlCategory: UrlCategory,
  username: string,
  method: 'GET' | 'POST',
  data: T2,
  opts: { headers?: any; params?: any; },
): Promise<T1> => {
  const getUrl = (): string => {
    const isSandbox = (): boolean => username.toLowerCase() === 'sandbox';
    const { urls } = config;

    return isSandbox()
      ? urls[urlCategory].sandbox
      : urls[urlCategory].live;
  };

  return axios({
    url: getUrl(),
    method,
    data,
    ...opts,
  }).then((value) => {
    if (![200, 201].includes(value.status)) {
      return Promise.reject(value.data);
    }

    return Promise.resolve(value.data);
  });
};
