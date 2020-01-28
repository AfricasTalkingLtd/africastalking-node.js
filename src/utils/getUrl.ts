import { BaseUrlCategory, Endpoints, EndpointCategory } from './getUrl.types';

const getBaseUrl = (baseUrlCategory: BaseUrlCategory, isSandbox: boolean): string => {
  switch (baseUrlCategory) {
    default:
    case 'API':
      return `https://api${isSandbox && '.sandbox'}.africastalking.com`;

    case 'PAYMENTS':
      return `https://payments${isSandbox && '.sandbox'}.africastalking.com`;

    case 'VOICE':
      return `https://voice${isSandbox && '.sandbox'}.africastalking.com`;
  }
};

const endpoints: Endpoints = {
  AIRTIME: { baseUrlCategory: 'API', endpoint: '/version1/airtime/send' },
  APPLICATION: { baseUrlCategory: 'API', endpoint: '/version1/user' },
  SMS: { baseUrlCategory: 'API', endpoint: '/version1/messaging' },
  GENERATE_AUTH_TOKEN: { baseUrlCategory: 'API', endpoint: '/auth-token/generate' },
  CREATE_CHECKOUT_TOKEN: { baseUrlCategory: 'API', endpoint: '/checkout/token/create' },
  CREATE_SUBSCRIPTION: { baseUrlCategory: 'API', endpoint: '/version1/subscription/create' },
  FETCH_SUBSCRIPTION: { baseUrlCategory: 'API', endpoint: '/version1/subscription' },
  DELETE_SUBSCRIPTION: { baseUrlCategory: 'API', endpoint: '/version1/subscription/delete' },
  MOBILE_CHECKOUT: { baseUrlCategory: 'PAYMENTS', endpoint: '/mobile/checkout/request' },
  MOBILE_B2C: { baseUrlCategory: 'PAYMENTS', endpoint: '/mobile/b2c/request' },
  MOBILE_B2B: { baseUrlCategory: 'PAYMENTS', endpoint: '/mobile/b2b/request' },
  MOBILE_DATA: { baseUrlCategory: 'PAYMENTS', endpoint: '/mobile/data/request' },
  BANK_CHECKOUT_CHARGE: { baseUrlCategory: 'PAYMENTS', endpoint: '/bank/checkout/charge' },
  BANK_CHECKOUT_VALIDATE: { baseUrlCategory: 'PAYMENTS', endpoint: '/bank/checkout/validate' },
  BANK_TRANSFER: { baseUrlCategory: 'PAYMENTS', endpoint: '/bank/transfer' },
  WALLET_TRANSFER: { baseUrlCategory: 'PAYMENTS', endpoint: '/transfer/wallet' },
  TOPUP_STASH: { baseUrlCategory: 'PAYMENTS', endpoint: '/topup/stash' },
  CARD_CHECKOUT_CHARGE: { baseUrlCategory: 'PAYMENTS', endpoint: '/card/checkout/charge' },
  CARD_CHECKOUT_VALIDATE: { baseUrlCategory: 'PAYMENTS', endpoint: '/card/checkout/validate' },
  FETCH_PRODUCT_TRANSACTIONS: { baseUrlCategory: 'PAYMENTS', endpoint: '/query/transaction/fetch' },
  FIND_TRANSACTION: { baseUrlCategory: 'PAYMENTS', endpoint: '/query/transaction/find' },
  FETCH_WALLET_TRANSACTIONS: { baseUrlCategory: 'PAYMENTS', endpoint: '/query/wallet/fetch' },
  FETCH_WALLET_BALANCE: { baseUrlCategory: 'PAYMENTS', endpoint: '/query/wallet/balance' },
  MAKE_CALL: { baseUrlCategory: 'VOICE', endpoint: '/call' },
  GET_NUM_QUEUED_CALLS: { baseUrlCategory: 'VOICE', endpoint: '/queueStatus' },
  UPLOAD_MEDIA_FILE: { baseUrlCategory: 'VOICE', endpoint: '/mediaUpload' },
};

export const getUrl = (endpointCategory: EndpointCategory, username: string): string => {
  const isSandbox = username.toLowerCase() === 'sandbox';
  const endpoint = endpoints[endpointCategory];

  return `${getBaseUrl(endpoint.baseUrlCategory, isSandbox)}${endpoint.endpoint}`;
};
