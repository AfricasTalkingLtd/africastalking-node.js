"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var axios_1 = __importDefault(require("axios"));
var getUrl_1 = require("./getUrl");
exports.validateJoiSchema = function (schema, data) {
    var _a = schema.validate(data), error = _a.error, value = _a.value;
    if (error) {
        var combinedMessages = error.details.map(function (d) { return d.message; }).join(';');
        throw new Error(combinedMessages);
    }
    return value;
};
exports.sendRequest = function (opts) {
    var endpointCategory = opts.endpointCategory, username = opts.username, method = opts.method, _a = opts.data, data = _a === void 0 ? null : _a, headers = opts.headers, params = opts.params;
    return axios_1.default({
        url: getUrl_1.getUrl(endpointCategory, username),
        method: method,
        data: data,
        headers: headers,
        params: params,
    }).then(function (value) {
        if (![200, 201].includes(value.status)) {
            return Promise.reject(value.data);
        }
        return Promise.resolve(value.data);
    });
};
exports.showDeprecationWarning = function (oldFunctionName, newFunctionName, releaseType, link) {
    if (releaseType === void 0) { releaseType = 'major'; }
    if (link === void 0) { link = 'https://github.com/AfricasTalkingLtd/africastalking-node.js'; }
    var header = chalk_1.default.bold.bgHex('#D15E00')("\n  Deprecation warning:");
    var msg = chalk_1.default.keyword('orange')("\n  " + chalk_1.default.bold(oldFunctionName) + " is being deprecated and will be removed in upcoming " + chalk_1.default.bold(releaseType) + " release.\n  Please use " + chalk_1.default.bold(newFunctionName) + " instead.\n  For more information, please refer to " + chalk_1.default.underline(link) + ".");
    console.warn("" + header + msg);
};
//# sourceMappingURL=misc.js.map