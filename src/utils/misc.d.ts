import { UrlCategory } from '../constants/index.interface';

export interface SendRequestOptions<T2, T3> {
  urlCategory: UrlCategory,
  username: string,
  method: 'GET' | 'POST',
  data?: T2,
  headers?: any;
  params?: T3;
}
