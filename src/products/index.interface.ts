export interface Credentials {
  apiKey: string;
  username: string;
  format: 'xml' | 'json';
}

export interface FullCredentials {
  apiKey: string;
  username: string;
  format: Format;
  isSandbox: boolean;
}

export type Format = 'application/xml' | 'application/json';
