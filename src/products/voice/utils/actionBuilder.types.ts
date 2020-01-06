export interface Action {
  tag: string;
  text: string;
  children?: {
    [child in Child]: any;
  };
  attributes?: {
    [key: string]: any;
  };
}

type Child = 'say' | 'play' | 'getDigits' | 'dial' | 'record'
| 'enqueue' | 'dequeue' | 'redirect' | 'conference' | 'reject';
