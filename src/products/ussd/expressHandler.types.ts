import { Request, Response, NextFunction } from 'express';

interface UssdRequestBody {
  sessionId: string;
  serviceCode: string;
  phoneNumber: string;
  text: string;
}

export interface UssdOptions {
  response: string;
  endSession: boolean;
}

export type UssdHandler = (
  body: UssdRequestBody,
  cb: (opts: UssdOptions) => void,
) => void;

export type ExpressHandler = (req: Request, res: Response, next: NextFunction) => void;
