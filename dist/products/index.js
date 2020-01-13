"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sms_1 = require("./sms");
var application_1 = require("./application");
var airtime_1 = require("./airtime");
var payments_1 = require("./payments");
var token_1 = require("./token");
var voice_1 = require("./voice");
var ussd_1 = require("./ussd");
exports.AfricasTalking = function (credentials) { return ({
    AIRTIME: airtime_1.AIRTIME(credentials),
    APPLICATION: application_1.APPLICATION(credentials),
    SMS: sms_1.SMS(credentials),
    PAYMENTS: payments_1.PAYMENTS(credentials),
    TOKEN: token_1.TOKEN(credentials),
    VOICE: voice_1.VOICE(credentials),
    USSD: ussd_1.USSD,
    ACCOUNT: application_1.APPLICATION(credentials),
    PAYMENT: payments_1.PAYMENTS(credentials),
}); };
//# sourceMappingURL=index.js.map