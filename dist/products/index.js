"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var misc_1 = require("../utils/misc");
var airtime_1 = require("./airtime");
var application_1 = require("./application");
var payments_1 = require("./payments");
var sms_1 = require("./sms");
var token_1 = require("./token");
var ussd_1 = require("./ussd");
var voice_1 = require("./voice");
__export(require("./airtime"));
__export(require("./application"));
__export(require("./payments"));
__export(require("./sms"));
__export(require("./token"));
__export(require("./ussd"));
__export(require("./voice"));
exports.AfricasTalking = function (credentials) { return ({
    AIRTIME: airtime_1.AIRTIME(credentials),
    APPLICATION: application_1.APPLICATION(credentials),
    PAYMENTS: payments_1.PAYMENTS(credentials),
    SMS: sms_1.SMS(credentials),
    TOKEN: token_1.TOKEN(credentials),
    USSD: ussd_1.USSD,
    VOICE: voice_1.VOICE(credentials),
    get ACCOUNT() {
        misc_1.showDeprecationWarning('AfricasTalking().ACCOUNT', 'AfricasTalking().APPLICATION', 'minor');
        return application_1.APPLICATION(credentials);
    },
    get PAYMENT() {
        misc_1.showDeprecationWarning('AfricasTalking().PAYMENT', 'AfricasTalking().PAYMENTS', 'minor');
        return payments_1.PAYMENTS(credentials);
    },
}); };
//# sourceMappingURL=index.js.map