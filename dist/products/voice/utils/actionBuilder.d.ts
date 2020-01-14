import { SayAttributes, SayOrPlayChildren, GetDigitsAttributes, DialAttributes, RecordAttributes, EnqueueAttributes, DequeueAttributes } from './actionBuilder.types';
export declare class ActionBuilder {
    private finalized;
    private xml;
    build(): string;
    private buildAction;
    say(text: string, attributes?: SayAttributes): void;
    play(url: string): void;
    getDigits(children: SayOrPlayChildren, attributes?: GetDigitsAttributes): void;
    dial(phoneNumbers: string, attributes?: DialAttributes): void;
    record(children: SayOrPlayChildren, attributes?: RecordAttributes): void;
    enqueue(attributes?: EnqueueAttributes): void;
    dequeue(phoneNumber: string, attributes?: DequeueAttributes): void;
    redirect(url: string): void;
    conference(): void;
    reject(): void;
}
