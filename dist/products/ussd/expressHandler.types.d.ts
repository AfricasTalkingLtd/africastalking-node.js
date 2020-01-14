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
export declare type UssdHandler = (body: UssdRequestBody, cb: (opts: UssdOptions) => void) => void;
export declare type ExpressHandler = (req: Request, res: Response, next: NextFunction) => void;
export {};
