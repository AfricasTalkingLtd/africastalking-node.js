import { SayAttributes, SayOrPlayChildren, GetDigitsAttributes, DialAttributes, RecordAttributes, EnqueueAttributes, DequeueAttributes } from './actionBuilder.types';
export declare class ActionBuilder {
    private finalized;
    private xml;
    build(): string;
    private buildAction;
    say(text: string, attributes?: SayAttributes): ActionBuilder;
    play(url: string): ActionBuilder;
    getDigits(children: SayOrPlayChildren, attributes?: GetDigitsAttributes): ActionBuilder;
    dial(phoneNumbers: string, attributes?: DialAttributes): ActionBuilder;
    record(children: SayOrPlayChildren, attributes?: RecordAttributes): ActionBuilder;
    enqueue(attributes?: EnqueueAttributes): ActionBuilder;
    dequeue(phoneNumber: string, attributes?: DequeueAttributes): ActionBuilder;
    redirect(url: string): ActionBuilder;
    conference(): ActionBuilder;
    reject(): ActionBuilder;
}
