import axios from 'axios';
import { FullCredentials, Format } from './index.interface';
import { config } from '../constants';

const sendRequest = (
  apiKey: string, username: string, isSandbox: boolean, format: Format,
): Promise<any> => {
  const { apiUrl: { APPLICATION } } = config;
  const url = isSandbox ? APPLICATION.sandbox : APPLICATION.live;

  return axios.get(url, {
    headers: {
      apiKey,
      accept: format,
    },
    params: {
      username,
    },
  }).then((value) => {
    if (value.status !== 200) {
      return Promise.reject(value.data);
    }

    return Promise.resolve(value.data);
  });
};

export const fetchApplicationData = (credentials: FullCredentials): Promise<any> => {
  const {
    apiKey, username, format, isSandbox,
  } = credentials;
  return sendRequest(apiKey, username, isSandbox, format);
};
