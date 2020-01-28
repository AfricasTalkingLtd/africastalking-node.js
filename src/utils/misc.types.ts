import { EndpointCategory } from './getUrl.types';

export interface SendRequestOptions<PostData, Params> {
  endpointCategory: EndpointCategory,
  username: string,
  method: 'GET' | 'POST',
  data?: PostData,
  headers?: any;
  params?: Params;
}
