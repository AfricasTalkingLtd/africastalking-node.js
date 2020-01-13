"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = __importDefault(require("joi"));
var misc_1 = require("./misc");
var getSchema = function () { return joi_1.default.object({
    apiKey: joi_1.default.string().required(),
    username: joi_1.default.string().required(),
    format: joi_1.default.string().valid('json', 'xml').required(),
}).required(); };
exports.getFullCredentials = function (credentials) {
    var value = misc_1.validateJoiSchema(getSchema(), credentials);
    return __assign(__assign({}, value), { format: value.format === 'xml' ? 'application/xml' : 'application/json' });
};
//# sourceMappingURL=getFullCredentials.js.map