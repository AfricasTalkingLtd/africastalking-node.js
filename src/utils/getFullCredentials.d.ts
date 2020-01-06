export interface Credentials {
  apiKey: string;
  username: string;
  format?: 'xml' | 'json';
}

export interface FullCredentials {
  apiKey: string;
  username: string;
  format: 'application/xml' | 'application/json';
}
