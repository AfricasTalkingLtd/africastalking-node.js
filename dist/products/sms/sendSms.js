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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = __importDefault(require("joi"));
var query_string_1 = __importDefault(require("query-string"));
var misc_1 = require("../../utils/misc");
var getFullCredentials_1 = require("../../utils/getFullCredentials");
var getSchema = function (isBulk, isPremium) {
    var schema = joi_1.default.object({
        to: joi_1.default.alternatives().try(joi_1.default.array().items(joi_1.default.string().regex(/^\+\d{1,3}\d{3,}$/, 'to').required()).required(), joi_1.default.string().regex(/^\+\d{1,3}\d{3,}$/, 'to').required()),
        message: joi_1.default.string().required(),
        from: joi_1.default.string(),
        enqueue: joi_1.default.boolean(),
    }).required();
    if (isBulk) {
        return schema.keys({
            bulkSMSMode: joi_1.default.boolean().required(),
        });
    }
    if (isPremium) {
        return schema.keys({
            keyword: joi_1.default.string().required(),
            linkId: joi_1.default.string(),
            retryDurationInHours: joi_1.default.number(),
        });
    }
    return schema;
};
exports.sendSms = function (credentials) { return function (options, isBulk, isPremium) {
    if (isBulk === void 0) { isBulk = false; }
    if (isPremium === void 0) { isPremium = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var _a, apiKey, username, format, result, to, bulkSMSMode, data;
        return __generator(this, function (_b) {
            _a = getFullCredentials_1.getFullCredentials(credentials), apiKey = _a.apiKey, username = _a.username, format = _a.format;
            result = misc_1.validateJoiSchema(getSchema(isBulk, isPremium), options);
            to = result.to;
            bulkSMSMode = __assign(__assign({}, (isBulk && { bulkSMSMode: true })), (isPremium && { bulkSMSMode: false }));
            data = __assign(__assign({ username: username }, result), { to: Array.isArray(to) ? to.join(',') : to, enqueue: result.enqueue ? 1 : 0, bulkSMSMode: bulkSMSMode ? 1 : 0 });
            return [2, misc_1.sendRequest({
                    endpointCategory: 'SMS',
                    username: username,
                    method: 'POST',
                    data: query_string_1.default.stringify(data),
                    headers: {
                        apiKey: apiKey,
                        accept: format,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                })];
        });
    });
}; };
//# sourceMappingURL=sendSms.js.map