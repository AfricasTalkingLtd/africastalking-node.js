export interface Config {
  urls: {
    [category in UrlCategory]: EndpointMetadata;
  };
  currencyCodes: CurrencyCode[];
}

export type UrlCategory = 'AIRTIME' | 'APPLICATION' | 'SMS' | 'TOKEN' | 'SUBSCRIPTION';

export interface EndpointMetadata {
  live: string;
  sandbox: string;
}

export type CurrencyCode = 'KES' | 'UGX' | 'TZS' | 'NGN';
