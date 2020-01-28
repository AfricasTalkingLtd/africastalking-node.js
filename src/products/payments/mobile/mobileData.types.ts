export interface MobileDataOptions {
  productName: string;
  recipients: {
    phoneNumber: string;
    quantity: number;
    unit: 'MB' | 'GB';
    validity: 'Day' | 'Month' | 'Week';
    metadata: {
      [key: string]: any;
    };
  }[];
}

export interface MobileDataPostData extends MobileDataOptions {
  username: string;
}

// TODO: no documentation available
export interface MobileDataResponse {

}

export type MobileData = (options: MobileDataOptions) => Promise<MobileDataResponse>;
