"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fetchMessages_1 = require("./fetchMessages");
var sendSms_1 = require("./sendSms");
var fetchSubscription_1 = require("./premiumSubscriptions/fetchSubscription");
var createSubscription_1 = require("./premiumSubscriptions/createSubscription");
var deleteSubscription_1 = require("./premiumSubscriptions/deleteSubscription");
exports.SMS = function (credentials) { return ({
    send: function (options) { return sendSms_1.sendSms(credentials)(options); },
    sendBulk: function (options) { return sendSms_1.sendSms(credentials)(options, true); },
    sendPremium: function (options) { return sendSms_1.sendSms(credentials)(options, false, true); },
    fetchMessages: fetchMessages_1.fetchMessages(credentials),
    fetchSubscription: fetchSubscription_1.fetchSubscription(credentials),
    createSubscription: createSubscription_1.createSubscription(credentials),
    deleteSubscription: deleteSubscription_1.deleteSubscription(credentials),
}); };
//# sourceMappingURL=index.js.map