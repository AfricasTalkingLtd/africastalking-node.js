import joi from 'joi';
import { Credentials } from '../../utils/getCredentials.interface';
import { WalletTransferOptions, WalletTransferResponse, WalletTransferPostData } from './walletTransfer.interface';
import { getFullCredentials } from '../../utils/getCredentials';
import { validateJoiSchema, sendRequest } from '../../utils/misc';

const getSchema = () => joi.object({
  productName: joi.string().regex(/\S/, 'no space').required(),
  targetProductCode: joi.number().required(),
  currencyCode: joi.string().valid('KES', 'UGX', 'USD').required(),
  amount: joi.number().required(),
  metadata: joi.object(),
}).required();

export const walletTransfer = (credentials: Credentials) => async (
  options: WalletTransferOptions,
): Promise<WalletTransferResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = await validateJoiSchema<WalletTransferOptions>(getSchema(), options);

  const postData: WalletTransferPostData = {
    ...result,
    username,
  };

  return sendRequest<WalletTransferResponse, WalletTransferPostData>('WALLET_TRANSFER', username, 'POST', postData, {
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/json',
    },
  });
};
