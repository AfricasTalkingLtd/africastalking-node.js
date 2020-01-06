export interface MobileDataOptions {
  productName: string;
  recipients: {
    phoneNumber: string;
    qty: number;
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

// TODO: no documentation available :-(
export interface MobileDataResponse {

}
