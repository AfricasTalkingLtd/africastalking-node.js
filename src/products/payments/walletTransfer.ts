import joi from 'joi';
import { Credentials } from '../../utils/getFullCredentials.types';
import {
  WalletTransferOptions, WalletTransferResponse, WalletTransferPostData, WalletTransfer,
} from './walletTransfer.types';
import { getFullCredentials } from '../../utils/getFullCredentials';
import { validateJoiSchema, sendRequest } from '../../utils/misc';
import { customRegex } from '../../utils/constants';

const getSchema = () => joi.object({
  productName: joi.string().regex(customRegex.noSpace, 'no space').required(),
  targetProductCode: joi.number().required(),
  currencyCode: joi.string().valid('KES', 'UGX', 'USD').required(),
  amount: joi.number().required(),
  metadata: joi.object(),
}).required();

export const walletTransfer = (
  credentials: Credentials,
): WalletTransfer => async (options) => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<WalletTransferOptions>(getSchema(), options);

  const data: WalletTransferPostData = {
    ...result,
    username,
  };

  return sendRequest<WalletTransferResponse, WalletTransferPostData>({
    endpointCategory: 'WALLET_TRANSFER',
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
