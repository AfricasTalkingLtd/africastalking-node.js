import { Request, NextFunction, Response } from 'express';
import { UssdHandler } from './ExpressHandler.types';
export declare const ExpressHandler: (handler: UssdHandler) => ((req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response, next: NextFunction) => void)[];
