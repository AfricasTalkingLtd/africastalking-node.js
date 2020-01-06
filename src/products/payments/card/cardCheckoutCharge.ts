import joi from 'joi';
import { Credentials } from '../../../utils/getFullCredentials.d';
import { CardCheckoutChargeOptions, CardCheckoutChargeResponse, CardCheckoutChargePostData } from './cardCheckoutCharge.d';
import { getFullCredentials } from '../../../utils/getFullCredentials';
import { validateJoiSchema, sendRequest } from '../../../utils/misc';

const getSchema = () => joi.object({
  productName: joi.string().regex(/\S/, 'no space').required(),
  paymentCard: joi.object({
    number: joi.number().required(),
    cvvNumber: joi.number().required(),
    expiryMonth: joi.number().required(),
    expiryYear: joi.number().required(),
    countryCode: joi.string().valid('NG').required(),
    authToken: joi.string().required(),
  }).when('checkoutToken', {
    is: joi.exist(),
    then: joi.forbidden(),
    otherwise: joi.required(),
  }),
  checkoutToken: joi.string().regex(/\S/, 'no space').when('paymentCard', {
    is: joi.exist(),
    then: joi.forbidden(),
    otherwise: joi.required(),
  }),
  currencyCode: joi.string().valid('KES', 'UGX', 'USD').required(),
  amount: joi.number().required(),
  narration: joi.string().regex(/\S/, 'no space').required(),
  metadata: joi.object(),
}).required();

export const cardCheckoutCharge = (credentials: Credentials) => async (
  options: CardCheckoutChargeOptions,
): Promise<CardCheckoutChargeResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = await validateJoiSchema<CardCheckoutChargeOptions>(getSchema(), options);

  const data: CardCheckoutChargePostData = {
    ...result,
    username,
  };

  return sendRequest<CardCheckoutChargeResponse, CardCheckoutChargePostData>({
    urlCategory: 'CARD_CHECKOUT_CHARGE',
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
