/// <reference types="express" />
import { Credentials } from '../utils/getFullCredentials.types';
export declare const AfricasTalking: (credentials: Credentials) => {
    AIRTIME: {
        send: (options: import("./airtime/sendAirtimeRequest.types").AirtimeOptions) => Promise<import("./airtime/sendAirtimeRequest.types").AirtimeResponse>;
    };
    APPLICATION: {
        fetchApplicationData: () => Promise<import("./application/fetchApplicationData.types").ApplicationResponse>;
        fetchAccount: () => Promise<import("./application/fetchApplicationData.types").ApplicationResponse>;
    };
    SMS: {
        send: (options: import("./sms/sendSms.types").SmsOptions) => Promise<import("./sms/sendSms.types").SmsResponse>;
        sendBulk: (options: import("./sms/sendSms.types").SmsOptions) => Promise<import("./sms/sendSms.types").SmsResponse>;
        sendPremium: (options: import("./sms/sendSms.types").SmsOptions) => Promise<import("./sms/sendSms.types").SmsResponse>;
        fetchMessages: (options: import("./sms/fetchMessages.types").FetchMessagesOptions) => Promise<import("./sms/fetchMessages.types").FetchMessagesResponse>;
        fetchSubscription: (options: import("./sms/premiumSubscriptions/fetchSubscription.types").FetchSubscriptionOptions) => Promise<import("./sms/premiumSubscriptions/fetchSubscription.types").FetchSubscriptionResponse>;
        createSubscription: (options: import("./sms/premiumSubscriptions/createSubscription.types").CreateSubscriptionOptions) => Promise<import("./sms/premiumSubscriptions/createSubscription.types").CreateSubscriptionResponse>;
        deleteSubscription: (options: import("./sms/premiumSubscriptions/deleteSubscription.types").DeleteSubscriptionOptions) => Promise<import("./sms/premiumSubscriptions/deleteSubscription.types").DeleteSubscriptionResponse>;
    };
    PAYMENTS: {
        mobileCheckout: (options: import("./payments/mobile/mobileCheckout.types").MobileCheckoutOptions) => Promise<import("./payments/mobile/mobileCheckout.types").MobileCheckoutResponse>;
        mobileB2C: (options: import("./payments/mobile/mobileB2C.types").MobileB2COptions) => Promise<import("./payments/mobile/mobileB2C.types").MobileB2CResponse>;
        mobileB2B: (options: import("./payments/mobile/mobileB2B.types").MobileB2BOptions) => Promise<import("./payments/mobile/mobileB2B.types").MobileB2BResponse>;
        bankCheckoutCharge: (options: import("./payments/bank/bankCheckoutCharge.types").BankCheckoutChargeOptions) => Promise<import("./payments/bank/bankCheckoutCharge.types").BankCheckoutChargeResponse>;
        bankCheckoutValidate: (options: import("./payments/bank/bankCheckoutValidate.types").BankCheckoutValidateOptions) => Promise<import("./payments/bank/bankCheckoutValidate.types").BankCheckoutValidateResponse>;
        bankTransfer: (options: import("./payments/bank/bankTransfer.types").BankTransferOptions) => Promise<import("./payments/bank/bankTransfer.types").BankTransferResponse>;
        walletTransfer: (options: import("./payments/walletTransfer.types").WalletTransferOptions) => Promise<import("./payments/walletTransfer.types").WalletTransferResponse>;
        topupStash: (options: import("./payments/topupStash.types").TopupStashOptions) => Promise<import("./payments/topupStash.types").TopupStashResponse>;
        cardCheckoutCharge: (options: import("./payments/card/cardCheckoutCharge.types").CardCheckoutChargeOptions) => Promise<import("./payments/card/cardCheckoutCharge.types").CardCheckoutChargeResponse>;
        cardCheckoutValidate: (options: import("./payments/card/cardCheckoutValidate.types").CardCheckoutValidateOptions) => Promise<import("./payments/card/cardCheckoutValidate.types").CardCheckoutValidateResponse>;
        fetchProductTransactions: (options: import("./payments/query/fetchProductTransactions.types").FetchProductTransactionsOptions) => Promise<import("./payments/query/fetchProductTransactions.types").FetchProductTransactionsResponse>;
        findTransaction: (options: import("./payments/query/findTransaction.types").FindTransactionOptions) => Promise<import("./payments/query/findTransaction.types").FindTransactionResponse>;
        fetchWalletTransactions: (options: import("./payments/query/fetchWalletTransactions.types").FetchWalletTransactionsOptions) => Promise<import("./payments/query/fetchWalletTransactions.types").FetchWalletTransactionsResponse>;
        fetchWalletBalance: () => Promise<import("./payments/query/fetchWalletBalance.types").FetchWalletBalanceResponse>;
        mobileData: (options: import("./payments/mobile/mobileData.types").MobileDataOptions) => Promise<import("./payments/mobile/mobileData.types").MobileDataResponse>;
        checkout: (options: import("./payments/mobile/mobileCheckout.types").MobileCheckoutOptions) => Promise<import("./payments/mobile/mobileCheckout.types").MobileCheckoutResponse>;
        checkOut: (options: import("./payments/mobile/mobileCheckout.types").MobileCheckoutOptions) => Promise<import("./payments/mobile/mobileCheckout.types").MobileCheckoutResponse>;
        payConsumer: (options: import("./payments/mobile/mobileB2C.types").MobileB2COptions) => Promise<import("./payments/mobile/mobileB2C.types").MobileB2CResponse>;
        payBusiness: (options: import("./payments/mobile/mobileB2B.types").MobileB2BOptions) => Promise<import("./payments/mobile/mobileB2B.types").MobileB2BResponse>;
        REASON: {
            SALARY: string;
            SALARY_WITH_CHARGE: string;
            BUSINESS: string;
            BUSINESS_WITH_CHARGE: string;
            PROMOTION: string;
        };
        PROVIDER: {
            ATHENA: string;
            MPESA: string;
        };
        TRANSFER_TYPE: {
            BUY_GOODS: string;
            PAYBILL: string;
            DISBURSE_FUNDS: string;
            B2B_TRANSFER: string;
        };
        BANK: {
            FCMB_NG: number;
            ZENITH_NG: number;
            ACCESS_NG: number;
            GTBANK_NG: number;
            ECOBANK_NG: number;
            DIAMOND_NG: number;
            PROVIDUS_NG: number;
            UNITY_NG: number;
            STANBIC_NG: number;
            STERLING_NG: number;
            PARKWAY_NG: number;
            AFRIBANK_NG: number;
            ENTREPRISE_NG: number;
            FIDELITY_NG: number;
            HERITAGE_NG: number;
            KEYSTONE_NG: number;
            SKYE_NG: number;
            STANCHART_NG: number;
            UNION_NG: number;
            UBA_NG: number;
            WEMA_NG: number;
            FIRST_NG: number;
        };
    };
    TOKEN: {
        generateAuthToken: () => Promise<import("./token/generateAuthToken.types").GenerateAuthTokenResponse>;
        createCheckoutToken: (phoneNumber: string) => Promise<import("./token/createCheckoutToken.types").CreateCheckoutTokenResponse>;
    };
    VOICE: {
        ActionBuilder: import("./voice/utils/actionBuilder").ActionBuilder;
        call: (options: import("./voice/makeCall.types").MakeCallOptions) => Promise<import("./voice/makeCall.types").MakeCallResponse>;
        getNumQueuedCalls: (options: import("./voice/getNumQueuedCalls.types").GetNumQueuedCallsOptions) => Promise<import("./voice/getNumQueuedCalls.types").GetNumQueuedCallsResponse>;
        uploadMediaFile: (options: import("./voice/uploadMediaFile.types").UploadMediaFileOptions) => Promise<import("./voice/uploadMediaFile.types").UploadMediaFileResponse>;
    };
    USSD: (handler: import("./ussd/ExpressHandler.types").UssdHandler) => ((req: import("express").Request<import("express-serve-static-core").ParamsDictionary>, res: import("express").Response, next: import("express").NextFunction) => void)[];
    ACCOUNT: {
        fetchApplicationData: () => Promise<import("./application/fetchApplicationData.types").ApplicationResponse>;
        fetchAccount: () => Promise<import("./application/fetchApplicationData.types").ApplicationResponse>;
    };
    PAYMENT: {
        mobileCheckout: (options: import("./payments/mobile/mobileCheckout.types").MobileCheckoutOptions) => Promise<import("./payments/mobile/mobileCheckout.types").MobileCheckoutResponse>;
        mobileB2C: (options: import("./payments/mobile/mobileB2C.types").MobileB2COptions) => Promise<import("./payments/mobile/mobileB2C.types").MobileB2CResponse>;
        mobileB2B: (options: import("./payments/mobile/mobileB2B.types").MobileB2BOptions) => Promise<import("./payments/mobile/mobileB2B.types").MobileB2BResponse>;
        bankCheckoutCharge: (options: import("./payments/bank/bankCheckoutCharge.types").BankCheckoutChargeOptions) => Promise<import("./payments/bank/bankCheckoutCharge.types").BankCheckoutChargeResponse>;
        bankCheckoutValidate: (options: import("./payments/bank/bankCheckoutValidate.types").BankCheckoutValidateOptions) => Promise<import("./payments/bank/bankCheckoutValidate.types").BankCheckoutValidateResponse>;
        bankTransfer: (options: import("./payments/bank/bankTransfer.types").BankTransferOptions) => Promise<import("./payments/bank/bankTransfer.types").BankTransferResponse>;
        walletTransfer: (options: import("./payments/walletTransfer.types").WalletTransferOptions) => Promise<import("./payments/walletTransfer.types").WalletTransferResponse>;
        topupStash: (options: import("./payments/topupStash.types").TopupStashOptions) => Promise<import("./payments/topupStash.types").TopupStashResponse>;
        cardCheckoutCharge: (options: import("./payments/card/cardCheckoutCharge.types").CardCheckoutChargeOptions) => Promise<import("./payments/card/cardCheckoutCharge.types").CardCheckoutChargeResponse>;
        cardCheckoutValidate: (options: import("./payments/card/cardCheckoutValidate.types").CardCheckoutValidateOptions) => Promise<import("./payments/card/cardCheckoutValidate.types").CardCheckoutValidateResponse>;
        fetchProductTransactions: (options: import("./payments/query/fetchProductTransactions.types").FetchProductTransactionsOptions) => Promise<import("./payments/query/fetchProductTransactions.types").FetchProductTransactionsResponse>;
        findTransaction: (options: import("./payments/query/findTransaction.types").FindTransactionOptions) => Promise<import("./payments/query/findTransaction.types").FindTransactionResponse>;
        fetchWalletTransactions: (options: import("./payments/query/fetchWalletTransactions.types").FetchWalletTransactionsOptions) => Promise<import("./payments/query/fetchWalletTransactions.types").FetchWalletTransactionsResponse>;
        fetchWalletBalance: () => Promise<import("./payments/query/fetchWalletBalance.types").FetchWalletBalanceResponse>;
        mobileData: (options: import("./payments/mobile/mobileData.types").MobileDataOptions) => Promise<import("./payments/mobile/mobileData.types").MobileDataResponse>;
        checkout: (options: import("./payments/mobile/mobileCheckout.types").MobileCheckoutOptions) => Promise<import("./payments/mobile/mobileCheckout.types").MobileCheckoutResponse>;
        checkOut: (options: import("./payments/mobile/mobileCheckout.types").MobileCheckoutOptions) => Promise<import("./payments/mobile/mobileCheckout.types").MobileCheckoutResponse>;
        payConsumer: (options: import("./payments/mobile/mobileB2C.types").MobileB2COptions) => Promise<import("./payments/mobile/mobileB2C.types").MobileB2CResponse>;
        payBusiness: (options: import("./payments/mobile/mobileB2B.types").MobileB2BOptions) => Promise<import("./payments/mobile/mobileB2B.types").MobileB2BResponse>;
        REASON: {
            SALARY: string;
            SALARY_WITH_CHARGE: string;
            BUSINESS: string;
            BUSINESS_WITH_CHARGE: string;
            PROMOTION: string;
        };
        PROVIDER: {
            ATHENA: string;
            MPESA: string;
        };
        TRANSFER_TYPE: {
            BUY_GOODS: string;
            PAYBILL: string;
            DISBURSE_FUNDS: string;
            B2B_TRANSFER: string;
        };
        BANK: {
            FCMB_NG: number;
            ZENITH_NG: number;
            ACCESS_NG: number;
            GTBANK_NG: number;
            ECOBANK_NG: number;
            DIAMOND_NG: number;
            PROVIDUS_NG: number;
            UNITY_NG: number;
            STANBIC_NG: number;
            STERLING_NG: number;
            PARKWAY_NG: number;
            AFRIBANK_NG: number;
            ENTREPRISE_NG: number;
            FIDELITY_NG: number;
            HERITAGE_NG: number;
            KEYSTONE_NG: number;
            SKYE_NG: number;
            STANCHART_NG: number;
            UNION_NG: number;
            UBA_NG: number;
            WEMA_NG: number;
            FIRST_NG: number;
        };
    };
};
