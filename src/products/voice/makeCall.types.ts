export interface MakeCallOptions {
  callFrom: string;
  callTo: string;
  clientRequestId?: string;
}

export interface MakeCallPostData {
  username: string;
  to: string;
  from: string;
  clientRequestId?: string;
}

export interface MakeCallResponse {
  entries: {
    phoneNumber: string;
    status: 'Queued' | 'InvalidPhoneNumber' | 'DestinationNotSupported' | 'InsufficientCredit';
    sessionId: 'None' | string;
  }[];
  errorMessage?: string;
}

export type MakeCall = (options: MakeCallOptions) => Promise<MakeCallResponse>;
