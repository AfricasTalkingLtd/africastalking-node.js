export interface Action {
  tag: 'Say' | 'Play' | 'GetDigits' | 'Dial' | 'Record' | 'Enqueue'
  | 'Dequeue' | 'Redirect' | 'Conference' | 'Reject';
  text?: string;
  children?: {
    [child in Child]: any;
  };
  attributes?: {
    [key: string]: any;
  };
}

export type Child = 'say' | 'play' | 'getDigits' | 'dial' | 'record'
| 'enqueue' | 'dequeue' | 'redirect' | 'conference' | 'reject';

export interface SayAttributes {
  voice?: 'man' | 'woman';
  playBeep?: boolean;
}

export interface SayOrPlayChildren {
  say?: { text: string; } & SayAttributes;
  play?: { url: string; };
}

export interface GetDigitsAttributes {
  callbackUrl?: string;
  numDigits?: number;
  timeout?: number;
  finishOnKey?: string;
}

export interface GetDigitsCombined {
  children: SayOrPlayChildren;
  attributes: GetDigitsAttributes;
}

export interface DialAttributes {
  record?: boolean;
  sequential?: boolean;
  callerId?: string;
  ringBackTone?: string;
  maxDuration?: number;
}

export interface RecordAttributes {
  finishOnKey?: string;
  maxLength?: number;
  timeout?: number;
  trimSilence?: boolean;
  playBeep?: boolean;
  callbackUrl?: string;
}

export interface EnqueueAttributes {
  holdMusic?: string;
  name?: 'None' | string;
}

export interface DequeueAttributes {
  name: string;
}

export interface RedirectAttributes {
  url: string;
}
