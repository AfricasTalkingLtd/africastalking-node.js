"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createSubscription_1 = require("./premiumSubscriptions/createSubscription");
var deleteSubscription_1 = require("./premiumSubscriptions/deleteSubscription");
var fetchSubscription_1 = require("./premiumSubscriptions/fetchSubscription");
var fetchMessages_1 = require("./fetchMessages");
var sendSms_1 = require("./sendSms");
exports.sms = function (credentials) { return ({
    createSubscription: createSubscription_1.createSubscription(credentials),
    deleteSubscription: deleteSubscription_1.deleteSubscription(credentials),
    fetchSubscription: fetchSubscription_1.fetchSubscription(credentials),
    fetchMessages: fetchMessages_1.fetchMessages(credentials),
    send: function (opts) { return sendSms_1.sendSms(credentials)(opts); },
    sendBulk: function (opts) { return sendSms_1.sendSms(credentials)(opts, true); },
    sendPremium: function (opts) { return sendSms_1.sendSms(credentials)(opts, false, true); },
}); };
//# sourceMappingURL=index.js.map