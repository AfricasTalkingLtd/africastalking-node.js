export interface Config {
  urls: {
    [category in UrlCategory]: {
      live: string;
      sandbox: string;
    };
  };
  currencyCodes: CurrencyCode[];
}

export type UrlCategory = 'AIRTIME' | 'APPLICATION' | 'SMS' | 'TOKEN'
| 'CREATE_SUBSCRIPTION' | 'FETCH_SUBSCRIPTION' | 'DELETE_SUBSCRIPTION';

export type CurrencyCode = 'KES' | 'UGX' | 'TZS' | 'NGN';
