"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sendAirtimeRequest_1 = require("./sendAirtimeRequest");
var misc_1 = require("../../utils/misc");
var sendAirtimeRequest_2 = require("./sendAirtimeRequest");
exports.sendAirtimeRequest = sendAirtimeRequest_2.sendAirtimeRequest;
exports.AIRTIME = function (credentials) { return ({
    sendAirtimeRequest: sendAirtimeRequest_1.sendAirtimeRequest(credentials),
    get send() {
        misc_1.showDeprecationWarning('AIRTIME.send()', 'AIRTIME.sendAirtimeRequest()', 'minor');
        return sendAirtimeRequest_1.sendAirtimeRequest(credentials);
    },
}); };
//# sourceMappingURL=index.js.map