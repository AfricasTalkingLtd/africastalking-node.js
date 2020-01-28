import joi from 'joi';
import {
  Action, SayAttributes, SayOrPlayChildren, GetDigitsAttributes,
  GetDigitsCombined, DialAttributes, RecordAttributes, EnqueueAttributes,
  DequeueAttributes, RedirectAttributes,
} from './actionBuilder.types';
import { validateJoiSchema } from '../misc';
import { customRegex } from '../constants';

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
      Object.entries(attributes).forEach(([key, value]) => {
        this.xml += ` ${key}="${value}"`;
      });
    }

    if (children && Object.keys(children)?.length > 0) {
      this.xml += '>';

      Object.entries(children).forEach(([child, opts]) => {
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
    } else {
      this.xml += text
        ? `>${text}</${tag}>`
        : '/>';
    }
  }

  public say(text: string, attributes?: SayAttributes): ActionBuilder {
    const getSchema = () => joi.object({
      text: joi.string().required(),
      voice: joi.string().valid('man', 'woman'),
      playBeep: joi.boolean(),
    }).required();

    const {
      text: formattedText, ...attr
    } = validateJoiSchema<SayAttributes & { text: string; }>(getSchema(), {
      ...attributes,
      text,
    });

    this.buildAction({ tag: 'Say', text: formattedText, attributes: attr });
    return this;
  }

  public play(url: string): ActionBuilder {
    const getSchema = () => joi.object({
      url: joi.string().uri().required(),
    }).required();

    const result = validateJoiSchema<SayAttributes>(getSchema(), { url });

    this.buildAction({ tag: 'Play', attributes: result });
    return this;
  }

  public getDigits(children: SayOrPlayChildren, attributes?: GetDigitsAttributes): ActionBuilder {
    const getSchema = () => joi.object({
      children: joi.object({
        say: joi.any(),
        play: joi.any(),
      }).xor('say', 'play').required(),
      attributes: joi.object({
        callbackUrl: joi.string(),
        numDigits: joi.number().integer(),
        timeout: joi.number(),
        finishOnKey: joi.string(),
      }),
    }).required();

    const result = validateJoiSchema<GetDigitsCombined>(getSchema(), {
      children,
      attributes,
    });

    this.buildAction({ tag: 'GetDigits', ...result as any });
    return this;
  }

  public dial(phoneNumbers: string, attributes?: DialAttributes): ActionBuilder {
    const getSchema = () => joi.object({
      phoneNumbers: joi.string().required(),
      record: joi.boolean(),
      sequential: joi.boolean(),
      callerId: joi.string().regex(customRegex.phoneNumber, 'phone number'),
      ringBackTone: joi.string().uri(),
      maxDuration: joi.number(),
    }).required();

    const result = validateJoiSchema<DialAttributes & { phoneNumbers: string; }>(
      getSchema(), { ...attributes, phoneNumbers },
    );

    this.buildAction({ tag: 'Dial', attributes: result });
    return this;
  }

  public record(children: SayOrPlayChildren, attributes?: RecordAttributes): ActionBuilder {
    const getSchema = () => joi.object({
      children: joi.object({
        say: joi.any(),
        play: joi.any(),
      }).xor('say', 'play').required(),
      attributes: joi.object({
        finishOnKey: joi.string(),
        maxLength: joi.number(),
        timeout: joi.number(),
        trimSilence: joi.boolean(),
        playBeep: joi.boolean(),
        callbackUrl: joi.string().uri(),
      }),
    }).required();

    const result = validateJoiSchema<GetDigitsCombined>(getSchema(), {
      children,
      attributes,
    });

    this.buildAction({ tag: 'Record', ...result as any });
    return this;
  }

  public enqueue(attributes?: EnqueueAttributes): ActionBuilder {
    const getSchema = () => joi.object({
      holdMusic: joi.string().uri(),
      name: joi.string(),
    });

    const result = validateJoiSchema<EnqueueAttributes>(getSchema(), attributes);

    this.buildAction({ tag: 'Enqueue', attributes: result });
    return this;
  }

  public dequeue(phoneNumber: string, attributes?: DequeueAttributes): ActionBuilder {
    const getSchema = () => joi.object({
      phoneNumber: joi.string().regex(customRegex.phoneNumber, 'phone number').required(),
      name: joi.string(),
    }).required();

    const result = validateJoiSchema<DequeueAttributes & { phoneNumber: string; }>(getSchema(), {
      ...attributes,
      phoneNumber,
    });

    this.buildAction({ tag: 'Dequeue', attributes: result });
    return this;
  }

  public redirect(url: string): ActionBuilder {
    const getSchema = () => joi.object({
      url: joi.string().uri().required(),
    }).required();

    const result = validateJoiSchema<RedirectAttributes>(getSchema(), { url });

    this.buildAction({ tag: 'Redirect', text: result.url });
    return this;
  }

  public conference(): ActionBuilder {
    this.buildAction({ tag: 'Conference' });
    return this;
  }

  public reject(): ActionBuilder {
    this.buildAction({ tag: 'Reject' });
    return this;
  }
}
