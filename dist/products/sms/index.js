"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createSubscription_1 = require("./premiumSubscriptions/createSubscription");
var deleteSubscription_1 = require("./premiumSubscriptions/deleteSubscription");
var fetchSubscription_1 = require("./premiumSubscriptions/fetchSubscription");
var fetchMessages_1 = require("./fetchMessages");
var sendSms_1 = require("./sendSms");
var misc_1 = require("../../utils/misc");
var createSubscription_2 = require("./premiumSubscriptions/createSubscription");
exports.createSubscription = createSubscription_2.createSubscription;
var deleteSubscription_2 = require("./premiumSubscriptions/deleteSubscription");
exports.deleteSubscription = deleteSubscription_2.deleteSubscription;
var fetchSubscription_2 = require("./premiumSubscriptions/fetchSubscription");
exports.fetchSubscription = fetchSubscription_2.fetchSubscription;
var fetchMessages_2 = require("./fetchMessages");
exports.fetchMessages = fetchMessages_2.fetchMessages;
var sendSms_2 = require("./sendSms");
exports.sendSms = sendSms_2.sendSms;
exports.sendBulk = sendSms_2.sendBulk;
exports.sendPremium = sendSms_2.sendPremium;
exports.SMS = function (credentials) { return ({
    createSubscription: createSubscription_1.createSubscription(credentials),
    deleteSubscription: deleteSubscription_1.deleteSubscription(credentials),
    fetchSubscription: fetchSubscription_1.fetchSubscription(credentials),
    fetchMessages: fetchMessages_1.fetchMessages(credentials),
    sendSms: sendSms_1.sendSms(credentials),
    sendBulk: sendSms_1.sendBulk(credentials),
    sendPremium: sendSms_1.sendPremium(credentials),
    get send() {
        misc_1.showDeprecationWarning('SMS.send()', 'SMS.sendSms()', 'minor');
        return sendSms_1.sendSms(credentials);
    },
}); };
//# sourceMappingURL=index.js.map