import { Schema } from 'joi';
import { SendRequestOptions } from './misc.types';
export declare const validateJoiSchema: <T>(schema: Schema, data: any) => T;
export declare const sendRequest: <Response_1, PostData = null, Params = any>(opts: SendRequestOptions<PostData, Params>) => Promise<Response_1>;
export declare const showDeprecationWarning: (oldFunctionName: string, newFunctionName: string, releaseType?: "minor" | "major", link?: string) => void;
