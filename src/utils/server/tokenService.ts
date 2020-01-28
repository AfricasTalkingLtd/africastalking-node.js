import grpc from 'grpc';
import path from 'path';
import { generateAuthToken } from '../../products/token/generateAuthToken';
import { Credentials } from '../getFullCredentials.types';
import {
  GetToken, SipCredential, GetSipCredentials, TokenService,
} from './tokenService.types';

const getToken = (credentials: Credentials): GetToken => async (_cxt, cb) => {
  try {
    const { token, lifetimeInSeconds } = await generateAuthToken(credentials)();

    cb(null, {
      token,
      expiration: Date.now() + (lifetimeInSeconds * 1000),
      username: credentials.username,
      environment: credentials.username === 'sandbox'
        ? 'sandbox'
        : 'production',
    });
  } catch (err) {
    cb(err, null);
  }
};

const getSipCredentials = (sipCredentials: SipCredential[]) : GetSipCredentials => (_cxt, cb) => {
  cb(null, { credentials: sipCredentials });
};

export const tokenService = (credentials: Credentials): TokenService => {
  const { africastalking: fd } = grpc.load(path.join(__dirname, './proto/com/africastalking/SdkServerService.proto'));
  let sipCredentials: SipCredential[] = [];

  return {
    definition: fd.SdkServerService.service,
    implementation: {
      getToken: getToken(credentials),
      getSipCredentials: getSipCredentials(sipCredentials),
    },
    addSipCredentials: (username, password, host, port = 5060, transport = 'udp') => {
      sipCredentials = [
        ...sipCredentials,
        {
          username, password, host, port, transport,
        },
      ];
    },
  };
};
