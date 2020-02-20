import joi from 'joi';
import { Credentials } from '../../../utils/getFullCredentials.types';
import {
  CardCheckoutChargeOptions, CardCheckoutChargeResponse,
  CardCheckoutChargePostData, CardCheckoutCharge,
} from './cardCheckoutCharge.types';
import { getFullCredentials } from '../../../utils/getFullCredentials';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';
import { customRegex } from '../../../utils/constants';

const getSchema = () => joi.object({
  productName: joi.string().regex(customRegex.noSpace, 'no space').required(),
  paymentCard: joi.object({
    number: joi.string().required(),
    cvvNumber: joi.number().required(),
    expiryMonth: joi.number().required(),
    expiryYear: joi.number().required(),
    countryCode: joi.string().valid('NG').required(),
    authToken: joi.string().required(),
  }),
  checkoutToken: joi.string().regex(customRegex.noSpace, 'no space'),
  currencyCode: joi.string().valid('KES', 'UGX', 'USD').required(),
  amount: joi.number().required(),
  narration: joi.string().regex(customRegex.noSpace, 'no space').required(),
  metadata: joi.object(),
}).xor('paymentCard', 'checkoutToken').required();

export const cardCheckoutCharge = (
  credentials: Credentials,
): CardCheckoutCharge => async (options) => {
  const { apiKey, username, format } = getFullCredentials(credentials);
  const result = validateJoiSchema<CardCheckoutChargeOptions>(getSchema(), options);

  const data: CardCheckoutChargePostData = {
    ...result,
    username,
  };

  return sendRequest<CardCheckoutChargeResponse, CardCheckoutChargePostData>({
    endpointCategory: 'CARD_CHECKOUT_CHARGE',
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
