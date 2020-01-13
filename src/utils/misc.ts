import { Schema } from 'joi';
import chalk from 'chalk';
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

export const showDeprecationWarning = (
  oldFunctionName: string,
  newFunctionName: string,
  releaseType: 'minor' | 'major' = 'minor',
  link: string = 'https://github.com/AfricasTalkingLtd/africastalking-node.js',
): void => {
  const header = chalk.bold.bgHex('#D15E00')(`
  Deprecation warning:`);

  const msg = chalk.keyword('orange')(`
  ${chalk.bold(oldFunctionName)} is being deprecated and will be removed in upcoming ${chalk.bold(releaseType)} release.
  Please use ${chalk.bold(newFunctionName)} instead.
  For more information, please refer to ${chalk.underline(link)}.`);

  // eslint-disable-next-line no-console
  console.warn(`${header}${msg}`);
};
