/// <reference types="express" />
export declare const USSD: (handler: import("./ExpressHandler.types").UssdHandler) => ((req: import("express").Request<import("express-serve-static-core").ParamsDictionary>, res: import("express").Response, next: import("express").NextFunction) => void)[];
