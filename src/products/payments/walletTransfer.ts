import joi from 'joi';
import { Credentials } from '../../utils/getFullCredentials.types';
import { WalletTransferOptions, WalletTransferResponse, WalletTransferPostData } from './walletTransfer.types';
import { getFullCredentials } from '../../utils/getFullCredentials';
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
  const result = validateJoiSchema<WalletTransferOptions>(getSchema(), options);

  const data: WalletTransferPostData = {
    ...result,
    username,
  };

  return sendRequest<WalletTransferResponse, WalletTransferPostData>({
    urlCategory: 'WALLET_TRANSFER',
    username,
    method: 'POST',
    data,
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/json',
    },
  });
};
