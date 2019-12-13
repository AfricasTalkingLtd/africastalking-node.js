export interface Config {
  apiUrl: {
    [product in Product]: {
      live: string;
      sandbox: string;
    };
  };
  currencyCodes: CurrencyCode[];
}

export type CurrencyCode = 'KES' | 'UGX' | 'TZS' | 'NGN';

export type Product = 'AIRTIME' | 'APPLICATION';
