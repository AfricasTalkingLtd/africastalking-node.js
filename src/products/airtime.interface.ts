import { CurrencyCode } from '../constants/index.interface';

export interface AirtimeOptions {
  recipients: {
    phoneNumber: string;
    currencyCode: CurrencyCode;
    amount: number;
  }[];
}

export interface PostData {
  username: string;
  recipients: {
    phoneNumber: string;
    amount: String;
  }[];
}
