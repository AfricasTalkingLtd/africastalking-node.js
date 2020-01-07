"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var constants_1 = require("../constants");
exports.validateJoiSchema = function (schema, data) {
    var _a = schema.validate(data), error = _a.error, value = _a.value;
    if (error) {
        var combinedMessages = error.details.map(function (d) { return d.message; }).join(';');
        throw new Error(combinedMessages);
    }
    return value;
};
var getUrl = function (urlCategory, username) {
    var isSandbox = function () { return username.toLowerCase() === 'sandbox'; };
    var urls = constants_1.config.urls;
    return isSandbox()
        ? urls[urlCategory].sandbox
        : urls[urlCategory].live;
};
exports.sendRequest = function (opts) {
    var urlCategory = opts.urlCategory, username = opts.username, method = opts.method, _a = opts.data, data = _a === void 0 ? null : _a, headers = opts.headers, params = opts.params;
    return axios_1.default({
        url: getUrl(urlCategory, username),
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
//# sourceMappingURL=misc.js.map