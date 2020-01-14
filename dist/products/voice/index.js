"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var actionBuilder_1 = require("./utils/actionBuilder");
var getNumQueuedCalls_1 = require("./getNumQueuedCalls");
var makeCall_1 = require("./makeCall");
var uploadMediaFile_1 = require("./uploadMediaFile");
exports.voice = function (credentials) { return ({
    ActionBuilder: actionBuilder_1.ActionBuilder,
    call: makeCall_1.makeCall(credentials),
    getNumQueuedCalls: getNumQueuedCalls_1.getNumQueuedCalls(credentials),
    uploadMediaFile: uploadMediaFile_1.uploadMediaFile(credentials),
}); };
//# sourceMappingURL=index.js.map