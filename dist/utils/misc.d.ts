import { Schema } from 'joi';
import { SendRequestOptions } from './misc.types';
export declare const validateJoiSchema: <T>(schema: Schema, data: any) => T;
export declare const sendRequest: <T1, T2 = null, T3 = any>(opts: SendRequestOptions<T2, T3>) => Promise<T1>;
