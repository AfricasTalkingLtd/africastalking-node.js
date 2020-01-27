"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var actionBuilder_1 = require("./utils/actionBuilder");
var getNumQueuedCalls_1 = require("./getNumQueuedCalls");
var makeCall_1 = require("./makeCall");
var uploadMediaFile_1 = require("./uploadMediaFile");
var misc_1 = require("../../utils/misc");
var actionBuilder_2 = require("./utils/actionBuilder");
exports.ActionBuilder = actionBuilder_2.ActionBuilder;
var getNumQueuedCalls_2 = require("./getNumQueuedCalls");
exports.getNumQueuedCalls = getNumQueuedCalls_2.getNumQueuedCalls;
var makeCall_2 = require("./makeCall");
exports.makeCall = makeCall_2.makeCall;
var uploadMediaFile_2 = require("./uploadMediaFile");
exports.uploadMediaFile = uploadMediaFile_2.uploadMediaFile;
exports.VOICE = function (credentials) { return ({
    ActionBuilder: actionBuilder_1.ActionBuilder,
    makeCall: makeCall_1.makeCall(credentials),
    getNumQueuedCalls: getNumQueuedCalls_1.getNumQueuedCalls(credentials),
    uploadMediaFile: uploadMediaFile_1.uploadMediaFile(credentials),
    get call() {
        misc_1.showDeprecationWarning('VOICE.call()', 'VOICE.makeCall()', 'minor');
        return makeCall_1.makeCall(credentials);
    },
}); };
//# sourceMappingURL=index.js.map