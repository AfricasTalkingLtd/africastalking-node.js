export interface Action {
    tag: 'Say' | 'Play' | 'GetDigits' | 'Dial' | 'Record' | 'Enqueue' | 'Dequeue' | 'Redirect' | 'Conference' | 'Reject';
    text?: string;
    children?: {
        [child in Child]: any;
    };
    attributes?: {
        [key: string]: any;
    };
}
export declare type Child = 'say' | 'play' | 'getDigits' | 'dial' | 'record' | 'enqueue' | 'dequeue' | 'redirect' | 'conference' | 'reject';
export interface SayAttributes {
    voice: 'man' | 'woman';
    playBeep: boolean;
}
export interface GetDigitsChildren {
    say: any;
    play: any;
}
export interface GetDigitsAttributes {
    numDigits: number;
    timeout: number;
    callbackUrl: string;
}
export interface GetDigitsCombined {
    children: GetDigitsChildren;
    attributes: GetDigitsAttributes;
}
export interface DialAttributes {
    record: boolean;
    sequential: boolean;
    callerId: string;
    ringBackTone: string;
    maxDuration: number;
}
export interface RecordAttributes {
    maxLength: number;
    timeout: number;
    trimSilence: boolean;
    playBeep: boolean;
    callbackUrl: string;
}
export interface EnqueueAttributes {
    holdMusic: string;
}
export interface DequeueAttributes {
    phoneNumber: string;
}
export interface RedirectAttributes {
    text: string;
}
