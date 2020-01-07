import { SayAttributes, GetDigitsChildren, GetDigitsAttributes, DialAttributes, RecordAttributes, EnqueueAttributes } from './actionBuilder.types';
export declare class ActionBuilder {
    private finalized;
    private xml;
    build(): string;
    private buildAction;
    say(text: string, attributes: SayAttributes): void;
    play(url: string): void;
    getDigits(children: GetDigitsChildren, attributes: GetDigitsAttributes): void;
    dial(phoneNumbers: string, attributes: DialAttributes): void;
    record(children: GetDigitsChildren, attributes: RecordAttributes): void;
    enqueue(attributes: EnqueueAttributes): void;
    dequeue(phoneNumber: string, attributes?: {}): void;
    redirect(text: string): void;
    conference(): void;
    reject(): void;
}
