import { UrlCategory } from '../constants/index.types';

export interface SendRequestOptions<PostData, Params> {
  urlCategory: UrlCategory,
  username: string,
  method: 'GET' | 'POST',
  data?: PostData,
  headers?: any;
  params?: Params;
}
