import { Request, Response, NextFunction } from 'express';


export interface UssdOptions {
  response: string;
  endSession: boolean;
}

interface UssdRequestBody {
  sessionId: string;
  serviceCode: string;
  phoneNumber: string;
  text: string;
}

export type UssdHandler = (
  body: UssdRequestBody,
  cb: (opts: UssdOptions) => void,
) => void;

export type ExpressHandler = (req: Request, res: Response, next: NextFunction) => void;
