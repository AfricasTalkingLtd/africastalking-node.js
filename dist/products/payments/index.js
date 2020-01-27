"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var bankCheckoutCharge_1 = require("./bank/bankCheckoutCharge");
var bankCheckoutValidate_1 = require("./bank/bankCheckoutValidate");
var bankTransfer_1 = require("./bank/bankTransfer");
var cardCheckoutCharge_1 = require("./card/cardCheckoutCharge");
var cardCheckoutValidate_1 = require("./card/cardCheckoutValidate");
var mobileB2B_1 = require("./mobile/mobileB2B");
var mobileB2C_1 = require("./mobile/mobileB2C");
var mobileCheckout_1 = require("./mobile/mobileCheckout");
var mobileData_1 = require("./mobile/mobileData");
var fetchProductTransactions_1 = require("./query/fetchProductTransactions");
var fetchWalletBalance_1 = require("./query/fetchWalletBalance");
var fetchWalletTransactions_1 = require("./query/fetchWalletTransactions");
var findTransaction_1 = require("./query/findTransaction");
var topupStash_1 = require("./topupStash");
var walletTransfer_1 = require("./walletTransfer");
var misc_1 = require("../../utils/misc");
var constants_1 = require("../../utils/constants");
var bankCheckoutCharge_2 = require("./bank/bankCheckoutCharge");
exports.bankCheckoutCharge = bankCheckoutCharge_2.bankCheckoutCharge;
var bankCheckoutValidate_2 = require("./bank/bankCheckoutValidate");
exports.bankCheckoutValidate = bankCheckoutValidate_2.bankCheckoutValidate;
var bankTransfer_2 = require("./bank/bankTransfer");
exports.bankTransfer = bankTransfer_2.bankTransfer;
var cardCheckoutCharge_2 = require("./card/cardCheckoutCharge");
exports.cardCheckoutCharge = cardCheckoutCharge_2.cardCheckoutCharge;
var cardCheckoutValidate_2 = require("./card/cardCheckoutValidate");
exports.cardCheckoutValidate = cardCheckoutValidate_2.cardCheckoutValidate;
var mobileB2B_2 = require("./mobile/mobileB2B");
exports.mobileB2B = mobileB2B_2.mobileB2B;
var mobileB2C_2 = require("./mobile/mobileB2C");
exports.mobileB2C = mobileB2C_2.mobileB2C;
var mobileCheckout_2 = require("./mobile/mobileCheckout");
exports.mobileCheckout = mobileCheckout_2.mobileCheckout;
var mobileData_2 = require("./mobile/mobileData");
exports.mobileData = mobileData_2.mobileData;
var fetchProductTransactions_2 = require("./query/fetchProductTransactions");
exports.fetchProductTransactions = fetchProductTransactions_2.fetchProductTransactions;
var fetchWalletBalance_2 = require("./query/fetchWalletBalance");
exports.fetchWalletBalance = fetchWalletBalance_2.fetchWalletBalance;
var fetchWalletTransactions_2 = require("./query/fetchWalletTransactions");
exports.fetchWalletTransactions = fetchWalletTransactions_2.fetchWalletTransactions;
var findTransaction_2 = require("./query/findTransaction");
exports.findTransaction = findTransaction_2.findTransaction;
var topupStash_2 = require("./topupStash");
exports.topupStash = topupStash_2.topupStash;
var walletTransfer_2 = require("./walletTransfer");
exports.walletTransfer = walletTransfer_2.walletTransfer;
exports.PAYMENTS = function (credentials) { return (__assign({ bankCheckoutCharge: bankCheckoutCharge_1.bankCheckoutCharge(credentials), bankCheckoutValidate: bankCheckoutValidate_1.bankCheckoutValidate(credentials), bankTransfer: bankTransfer_1.bankTransfer(credentials), cardCheckoutCharge: cardCheckoutCharge_1.cardCheckoutCharge(credentials), cardCheckoutValidate: cardCheckoutValidate_1.cardCheckoutValidate(credentials), mobileB2B: mobileB2B_1.mobileB2B(credentials), mobileB2C: mobileB2C_1.mobileB2C(credentials), mobileCheckout: mobileCheckout_1.mobileCheckout(credentials), mobileData: mobileData_1.mobileData(credentials), fetchProductTransactions: fetchProductTransactions_1.fetchProductTransactions(credentials), fetchWalletBalance: fetchWalletBalance_1.fetchWalletBalance(credentials), fetchWalletTransactions: fetchWalletTransactions_1.fetchWalletTransactions(credentials), findTransaction: findTransaction_1.findTransaction(credentials), topupStash: topupStash_1.topupStash(credentials), walletTransfer: walletTransfer_1.walletTransfer(credentials), get checkout() {
        misc_1.showDeprecationWarning('PAYMENTS.checkout()', 'PAYMENTS.mobileCheckout()', 'minor');
        return mobileCheckout_1.mobileCheckout(credentials);
    },
    get checkOut() {
        misc_1.showDeprecationWarning('PAYMENTS.checkOut()', 'PAYMENTS.mobileCheckout()', 'minor');
        return mobileCheckout_1.mobileCheckout(credentials);
    },
    get payConsumer() {
        misc_1.showDeprecationWarning('PAYMENTS.payConsumer()', 'PAYMENTS.mobileB2C()', 'minor');
        return mobileB2C_1.mobileB2C(credentials);
    },
    get payBusiness() {
        misc_1.showDeprecationWarning('PAYMENTS.payBusiness()', 'PAYMENTS.mobileB2B()', 'minor');
        return mobileB2B_1.mobileB2B(credentials);
    } }, constants_1.CONSTANTS)); };
//# sourceMappingURL=index.js.map