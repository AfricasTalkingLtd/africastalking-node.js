"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sendAirtimeRequest_1 = require("./sendAirtimeRequest");
exports.AIRTIME = function (credentials) { return ({
    send: sendAirtimeRequest_1.sendAirtimeRequest(credentials),
}); };
//# sourceMappingURL=index.js.map