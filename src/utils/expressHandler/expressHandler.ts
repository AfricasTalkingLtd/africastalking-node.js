import joi from 'joi';
import bodyParser from 'body-parser';
import { Request, NextFunction, Response } from 'express';
import { validateJoiSchema, showDeprecationWarning } from '../misc';
import { UssdOptions, UssdHandler, ExpressHandler } from './expressHandler.types';

export const expressHandler = (handler: UssdHandler): ExpressHandler[] => {
  showDeprecationWarning('expressHandler', undefined, 'minor');

  return [
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
};
