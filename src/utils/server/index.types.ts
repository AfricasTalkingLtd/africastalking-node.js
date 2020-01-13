export type Authenticator = (client: any, cb: Function) => void;

// TODO: no documentation available
export interface StartOptions {
  certChainFile: any;
  privateKeyFile: any;
  rootCertFile: any;
  port: any;
  insecure: any;
}
