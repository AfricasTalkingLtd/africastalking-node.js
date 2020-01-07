"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var makeCall_1 = require("./makeCall");
var getNumQueuedCalls_1 = require("./getNumQueuedCalls");
var uploadMediaFile_1 = require("./uploadMediaFile");
var actionBuilder_1 = require("./utils/actionBuilder");
exports.VOICE = function (credentials) { return ({
    ActionBuilder: new actionBuilder_1.ActionBuilder(),
    call: makeCall_1.makeCall(credentials),
    getNumQueuedCalls: getNumQueuedCalls_1.getNumQueuedCalls(credentials),
    uploadMediaFile: uploadMediaFile_1.uploadMediaFile(credentials),
}); };
//# sourceMappingURL=index.js.map