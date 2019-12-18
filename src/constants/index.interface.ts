export interface Config {
  urls: {
    [category in UrlCategory]: {
      live: string;
      sandbox: string;
    };
  };
}

export type UrlCategory = 'AIRTIME' | 'APPLICATION' | 'SMS' | 'TOKEN'
| 'CREATE_SUBSCRIPTION' | 'FETCH_SUBSCRIPTION' | 'DELETE_SUBSCRIPTION'
| 'MOBILE_CHECKOUT' | 'MOBILE_B2C' | 'MOBILE_B2B' | 'BANK_CHECKOUT_CHARGE'
| 'BANK_CHECKOUT_VALIDATE' | 'BANK_TRANSFER' | 'WALLET_TRANSFER';
