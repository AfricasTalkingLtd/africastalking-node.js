"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mobileCheckout_1 = require("./mobile/mobileCheckout");
var mobileB2C_1 = require("./mobile/mobileB2C");
var mobileB2B_1 = require("./mobile/mobileB2B");
var bankCheckoutCharge_1 = require("./bank/bankCheckoutCharge");
var bankCheckoutValidate_1 = require("./bank/bankCheckoutValidate");
var bankTransfer_1 = require("./bank/bankTransfer");
var walletTransfer_1 = require("./walletTransfer");
var topupStash_1 = require("./topupStash");
var cardCheckoutCharge_1 = require("./card/cardCheckoutCharge");
var cardCheckoutValidate_1 = require("./card/cardCheckoutValidate");
var fetchProductTransactions_1 = require("./query/fetchProductTransactions");
var findTransaction_1 = require("./query/findTransaction");
var fetchWalletTransactions_1 = require("./query/fetchWalletTransactions");
var fetchWalletBalance_1 = require("./query/fetchWalletBalance");
var mobileData_1 = require("./mobile/mobileData");
exports.PAYMENTS = function (credentials) { return ({
    mobileCheckout: mobileCheckout_1.mobileCheckout(credentials),
    mobileB2C: mobileB2C_1.mobileB2C(credentials),
    mobileB2B: mobileB2B_1.mobileB2B(credentials),
    bankCheckoutCharge: bankCheckoutCharge_1.bankCheckoutCharge(credentials),
    bankCheckoutValidate: bankCheckoutValidate_1.bankCheckoutValidate(credentials),
    bankTransfer: bankTransfer_1.bankTransfer(credentials),
    walletTransfer: walletTransfer_1.walletTransfer(credentials),
    topupStash: topupStash_1.topupStash(credentials),
    cardCheckoutCharge: cardCheckoutCharge_1.cardCheckoutCharge(credentials),
    cardCheckoutValidate: cardCheckoutValidate_1.cardCheckoutValidate(credentials),
    fetchProductTransactions: fetchProductTransactions_1.fetchProductTransactions(credentials),
    findTransaction: findTransaction_1.findTransaction(credentials),
    fetchWalletTransactions: fetchWalletTransactions_1.fetchWalletTransactions(credentials),
    fetchWalletBalance: fetchWalletBalance_1.fetchWalletBalance(credentials),
    mobileData: mobileData_1.mobileData(credentials),
    checkout: mobileCheckout_1.mobileCheckout(credentials),
    checkOut: mobileCheckout_1.mobileCheckout(credentials),
    payConsumer: mobileB2C_1.mobileB2C(credentials),
    payBusiness: mobileB2B_1.mobileB2B(credentials),
    REASON: {
        SALARY: 'SalaryPayment',
        SALARY_WITH_CHARGE: 'SalaryPaymentWithWithdrawalChargePaid',
        BUSINESS: 'BusinessPayment',
        BUSINESS_WITH_CHARGE: 'BusinessPaymentWithWithdrawalChargePaid',
        PROMOTION: 'PromotionPayment',
    },
    PROVIDER: {
        ATHENA: 'Athena',
        MPESA: 'Mpesa',
    },
    TRANSFER_TYPE: {
        BUY_GOODS: 'BusinessBuyGoods',
        PAYBILL: 'BusinessPayBill',
        DISBURSE_FUNDS: 'DisburseFundsToBusiness',
        B2B_TRANSFER: 'BusinessToBusinessTransfer',
    },
    BANK: {
        FCMB_NG: 234001,
        ZENITH_NG: 234002,
        ACCESS_NG: 234003,
        GTBANK_NG: 234004,
        ECOBANK_NG: 234005,
        DIAMOND_NG: 234006,
        PROVIDUS_NG: 234007,
        UNITY_NG: 234008,
        STANBIC_NG: 234009,
        STERLING_NG: 234010,
        PARKWAY_NG: 234011,
        AFRIBANK_NG: 234012,
        ENTREPRISE_NG: 234013,
        FIDELITY_NG: 234014,
        HERITAGE_NG: 234015,
        KEYSTONE_NG: 234016,
        SKYE_NG: 234017,
        STANCHART_NG: 234018,
        UNION_NG: 234019,
        UBA_NG: 234020,
        WEMA_NG: 234021,
        FIRST_NG: 234022,
    },
}); };
//# sourceMappingURL=index.js.map