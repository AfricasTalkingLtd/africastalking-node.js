"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var misc_1 = require("../utils/misc");
var airtime_1 = require("./airtime");
var application_1 = require("./application");
var payments_1 = require("./payments");
var sms_1 = require("./sms");
var token_1 = require("./token");
var voice_1 = require("./voice");
var ussd_1 = require("./ussd");
exports.AfricasTalking = function (credentials) { return ({
    AIRTIME: airtime_1.airtime(credentials),
    APPLICATION: application_1.application(credentials),
    PAYMENTS: payments_1.payments(credentials),
    SMS: sms_1.sms(credentials),
    TOKEN: token_1.token(credentials),
    VOICE: voice_1.voice(credentials),
    USSD: ussd_1.ussd,
    get ACCOUNT() {
        misc_1.showDeprecationWarning('AfricasTalking().ACCOUNT', 'AfricasTalking().APPLICATION', 'minor');
        return application_1.application(credentials);
    },
    get PAYMENT() {
        misc_1.showDeprecationWarning('AfricasTalking().PAYMENT', 'AfricasTalking().PAYMENTS', 'minor');
        return payments_1.payments(credentials);
    },
}); };
//# sourceMappingURL=index.js.map