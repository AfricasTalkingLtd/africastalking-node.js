export type Authenticator = (client: any, cb: Function) => void;

// TODO:
export interface StartOptions {
  certChainFile: any;
  privateKeyFile: any;
  rootCertFile: any;
  port: any;
  insecure: any;
}
