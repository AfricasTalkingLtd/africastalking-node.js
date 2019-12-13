import axios from 'axios';
import { FullCredentials } from './index.interface';
import { config } from '../constants';

const sendRequest = (apiKey: string, username: string, isSandbox: boolean): Promise<any> => {
  const { apiUrl: { APPLICATION } } = config;
  const url = isSandbox ? APPLICATION.sandbox : APPLICATION.live;

  return axios.get(url, {
    headers: {
      apiKey,
      accept: this.credentials.format,
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
  const { apiKey, username, isSandbox } = credentials;
  return sendRequest(apiKey, username, isSandbox);
};
