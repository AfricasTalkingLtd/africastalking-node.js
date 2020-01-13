import joi from 'joi';
import bodyParser from 'body-parser';
import { Request, NextFunction, Response } from 'express';
import { validateJoiSchema } from '../../utils/misc';
import { UssdOptions, UssdHandler } from './ExpressHandler.types';

export const ExpressHandler = (handler: UssdHandler) => [
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json(),
  (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;

    handler(body, (options: UssdOptions) => {
      const getSchema = () => joi.object({
        response: joi.string().required(),
        endSession: joi.boolean().required(),
      }).required();

      try {
        const result = validateJoiSchema<UssdOptions>(getSchema(), options);

        res
          .contentType('text/plain')
          .status(200)
          .send(`${result.endSession ? 'END' : 'CON'} ${result.response}`);
      } catch (err) {
        next(err);
      }
    });
  },
];