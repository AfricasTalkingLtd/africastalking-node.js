import joi from 'joi';
import {
  Action, Child, SayAttributes, GetDigitsChildren, GetDigitsAttributes,
  GetDigitsCombined, DialAttributes, RecordAttributes, EnqueueAttributes,
  DequeueAttributes, RedirectAttributes,
} from './actionBuilder.types';
import { validateJoiSchema } from '../../../utils/misc';

export class ActionBuilder {
  private finalized = false;

  private xml = '<?xml version="1.0" encoding="UTF-8"?><Response>';

  public build(): string {
    if (this.finalized) {
      throw new Error('This builder has been finalized by a call to build()');
    }

    this.finalized = true;
    this.xml += '</Response>';
    return this.xml;
  }

  private buildAction(action: Action): void {
    const {
      tag, text, children, attributes,
    } = action;

    this.xml += `<${tag}`;

    if (attributes) {
      Object.keys(attributes).map((key) => {
        this.xml += ` ${key}="${attributes[key]}"`;
        return key;
      });
    }

    if (children) {
      const childrenKeys = Object.keys(children) as Child[];
      if (childrenKeys?.length > 0) {
        this.xml += '>';

        childrenKeys.map((child) => {
          const opts = children[child];

          switch (child) {
            case 'say': this.say(opts.text, opts.attributes); break;
            case 'play': this.play(opts.url); break;
            case 'getDigits': this.getDigits(opts.children, opts.attributes); break;
            case 'dial': this.dial(opts.phoneNumbers, opts.attributes); break;
            case 'record': this.record(opts.children, opts.attributes); break;
            case 'enqueue': this.enqueue(opts.attributes); break;
            case 'dequeue': this.dequeue(opts.phoneNumber, opts.attributes); break;
            case 'redirect': this.redirect(opts.text); break;
            case 'conference': this.conference(); break;
            case 'reject': this.reject(); break;
            default: throw new Error('Invalid child');
          }

          return child;
        });

        this.xml += `</${tag}>`;
      }
    } else {
      this.xml += text
        ? `>${text}</${tag}>`
        : '/>';
    }
  }

  public say(text: string, attributes: SayAttributes): void {
    const getSchema = () => joi.object({
      text: joi.string().required(),
      voice: joi.string().valid('man', 'woman'),
      playBeep: joi.boolean(),
    }).required();

    const result = validateJoiSchema<SayAttributes & { text: string; }>(getSchema(), {
      ...attributes,
      text,
    });

    this.buildAction({ tag: 'Say', text: result.text, attributes: result });
  }

  public play(url: string): void {
    const getSchema = () => joi.object({
      url: joi.string().uri().required(),
    }).required();

    const result = validateJoiSchema<SayAttributes>(getSchema(), { url });

    this.buildAction({ tag: 'Play', attributes: result });
  }

  public getDigits(children: GetDigitsChildren, attributes: GetDigitsAttributes): void {
    const getSchema = () => joi.object({
      children: joi.object({
        say: joi.any(),
        play: joi.any(),
      }).required(),
      attributes: joi.object({
        numDigits: joi.number().integer(),
        timeout: joi.number(),
        callbackUrl: joi.string(),
      }).required(),
    }).required();

    const result = validateJoiSchema<GetDigitsCombined>(getSchema(), {
      children,
      attributes,
    });

    this.buildAction({ tag: 'GetDigits', ...result as any });
  }

  public dial(phoneNumbers: string, attributes: DialAttributes): void {
    const getSchema = () => joi.object({
      phoneNumbers: joi.string().required(),
      record: joi.boolean(),
      sequential: joi.boolean(),
      callerId: joi.string().regex(/^\+\d{1,3}\d{3,}$/, 'phone number'),
      ringBackTone: joi.string().uri(),
      maxDuration: joi.number(),
    }).required();

    const result = validateJoiSchema<DialAttributes & { phoneNumbers: string; }>(
      getSchema(), { ...attributes, phoneNumbers },
    );

    this.buildAction({ tag: 'Dial', attributes: result });
  }

  public record(children: GetDigitsChildren, attributes: RecordAttributes): void {
    const getSchema = () => joi.object({
      children: joi.object({
        say: joi.any(),
        play: joi.any(),
      }).required(),
      attributes: joi.object({
        maxLength: joi.number(),
        timeout: joi.number(),
        trimSilence: joi.boolean(),
        playBeep: joi.boolean(),
        callbackUrl: joi.string().uri(),
      }).required(),
    }).required();

    const result = validateJoiSchema<GetDigitsCombined>(getSchema(), {
      children,
      attributes,
    });

    this.buildAction({ tag: 'Record', ...result as any });
  }

  public enqueue(attributes: EnqueueAttributes): void {
    const getSchema = () => joi.object({
      holdMusic: joi.string().uri(),
    }).required();

    const result = validateJoiSchema<SayAttributes>(getSchema(), attributes);

    this.buildAction({ tag: 'Enqueue', attributes: result });
  }

  public dequeue(phoneNumber: string, attributes = {}): void {
    const getSchema = () => joi.object({
      phoneNumber: joi.string().regex(/^\+\d{1,3}\d{3,}$/, 'phone number').required(),
    }).required();

    const result = validateJoiSchema<DequeueAttributes>(getSchema(), {
      ...attributes,
      phoneNumber,
    });

    this.buildAction({ tag: 'Dequeue', attributes: result });
  }

  public redirect(text: string): void {
    const getSchema = () => joi.object({
      text: joi.string().required(),
    }).required();

    const result = validateJoiSchema<RedirectAttributes>(getSchema(), { text });

    this.buildAction({ tag: 'Redirect', text: result.text });
  }

  public conference(): void {
    this.buildAction({ tag: 'Conference' });
  }

  public reject(): void {
    this.buildAction({ tag: 'Reject' });
  }
}
