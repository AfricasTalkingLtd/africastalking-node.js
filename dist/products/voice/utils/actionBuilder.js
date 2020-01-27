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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = __importDefault(require("joi"));
var misc_1 = require("../../../utils/misc");
var constants_1 = require("../../../utils/constants");
var ActionBuilder = (function () {
    function ActionBuilder() {
        this.finalized = false;
        this.xml = '<?xml version="1.0" encoding="UTF-8"?><Response>';
    }
    ActionBuilder.prototype.build = function () {
        if (this.finalized) {
            throw new Error('This builder has been finalized by a call to build()');
        }
        this.finalized = true;
        this.xml += '</Response>';
        return this.xml;
    };
    ActionBuilder.prototype.buildAction = function (action) {
        var _this = this;
        var _a;
        var tag = action.tag, text = action.text, children = action.children, attributes = action.attributes;
        this.xml += "<" + tag;
        if (attributes) {
            Object.entries(attributes).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                _this.xml += " " + key + "=\"" + value + "\"";
            });
        }
        if (children && ((_a = Object.keys(children)) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            this.xml += '>';
            Object.entries(children).forEach(function (_a) {
                var child = _a[0], opts = _a[1];
                switch (child) {
                    case 'say':
                        _this.say(opts.text, opts.attributes);
                        break;
                    case 'play':
                        _this.play(opts.url);
                        break;
                    case 'getDigits':
                        _this.getDigits(opts.children, opts.attributes);
                        break;
                    case 'dial':
                        _this.dial(opts.phoneNumbers, opts.attributes);
                        break;
                    case 'record':
                        _this.record(opts.children, opts.attributes);
                        break;
                    case 'enqueue':
                        _this.enqueue(opts.attributes);
                        break;
                    case 'dequeue':
                        _this.dequeue(opts.phoneNumber, opts.attributes);
                        break;
                    case 'redirect':
                        _this.redirect(opts.text);
                        break;
                    case 'conference':
                        _this.conference();
                        break;
                    case 'reject':
                        _this.reject();
                        break;
                    default: throw new Error('Invalid child');
                }
                return child;
            });
            this.xml += "</" + tag + ">";
        }
        else {
            this.xml += text
                ? ">" + text + "</" + tag + ">"
                : '/>';
        }
    };
    ActionBuilder.prototype.say = function (text, attributes) {
        var getSchema = function () { return joi_1.default.object({
            text: joi_1.default.string().required(),
            voice: joi_1.default.string().valid('man', 'woman'),
            playBeep: joi_1.default.boolean(),
        }).required(); };
        var _a = misc_1.validateJoiSchema(getSchema(), __assign(__assign({}, attributes), { text: text })), formattedText = _a.text, attr = __rest(_a, ["text"]);
        this.buildAction({ tag: 'Say', text: formattedText, attributes: attr });
        return this;
    };
    ActionBuilder.prototype.play = function (url) {
        var getSchema = function () { return joi_1.default.object({
            url: joi_1.default.string().uri().required(),
        }).required(); };
        var result = misc_1.validateJoiSchema(getSchema(), { url: url });
        this.buildAction({ tag: 'Play', attributes: result });
        return this;
    };
    ActionBuilder.prototype.getDigits = function (children, attributes) {
        var getSchema = function () { return joi_1.default.object({
            children: joi_1.default.object({
                say: joi_1.default.any(),
                play: joi_1.default.any(),
            }).xor('say', 'play').required(),
            attributes: joi_1.default.object({
                callbackUrl: joi_1.default.string(),
                numDigits: joi_1.default.number().integer(),
                timeout: joi_1.default.number(),
                finishOnKey: joi_1.default.string(),
            }),
        }).required(); };
        var result = misc_1.validateJoiSchema(getSchema(), {
            children: children,
            attributes: attributes,
        });
        this.buildAction(__assign({ tag: 'GetDigits' }, result));
        return this;
    };
    ActionBuilder.prototype.dial = function (phoneNumbers, attributes) {
        var getSchema = function () { return joi_1.default.object({
            phoneNumbers: joi_1.default.string().required(),
            record: joi_1.default.boolean(),
            sequential: joi_1.default.boolean(),
            callerId: joi_1.default.string().regex(constants_1.customRegex.phoneNumber, 'phone number'),
            ringBackTone: joi_1.default.string().uri(),
            maxDuration: joi_1.default.number(),
        }).required(); };
        var result = misc_1.validateJoiSchema(getSchema(), __assign(__assign({}, attributes), { phoneNumbers: phoneNumbers }));
        this.buildAction({ tag: 'Dial', attributes: result });
        return this;
    };
    ActionBuilder.prototype.record = function (children, attributes) {
        var getSchema = function () { return joi_1.default.object({
            children: joi_1.default.object({
                say: joi_1.default.any(),
                play: joi_1.default.any(),
            }).xor('say', 'play').required(),
            attributes: joi_1.default.object({
                finishOnKey: joi_1.default.string(),
                maxLength: joi_1.default.number(),
                timeout: joi_1.default.number(),
                trimSilence: joi_1.default.boolean(),
                playBeep: joi_1.default.boolean(),
                callbackUrl: joi_1.default.string().uri(),
            }),
        }).required(); };
        var result = misc_1.validateJoiSchema(getSchema(), {
            children: children,
            attributes: attributes,
        });
        this.buildAction(__assign({ tag: 'Record' }, result));
        return this;
    };
    ActionBuilder.prototype.enqueue = function (attributes) {
        var getSchema = function () { return joi_1.default.object({
            holdMusic: joi_1.default.string().uri(),
            name: joi_1.default.string(),
        }); };
        var result = misc_1.validateJoiSchema(getSchema(), attributes);
        this.buildAction({ tag: 'Enqueue', attributes: result });
        return this;
    };
    ActionBuilder.prototype.dequeue = function (phoneNumber, attributes) {
        var getSchema = function () { return joi_1.default.object({
            phoneNumber: joi_1.default.string().regex(constants_1.customRegex.phoneNumber, 'phone number').required(),
            name: joi_1.default.string(),
        }).required(); };
        var result = misc_1.validateJoiSchema(getSchema(), __assign(__assign({}, attributes), { phoneNumber: phoneNumber }));
        this.buildAction({ tag: 'Dequeue', attributes: result });
        return this;
    };
    ActionBuilder.prototype.redirect = function (url) {
        var getSchema = function () { return joi_1.default.object({
            url: joi_1.default.string().uri().required(),
        }).required(); };
        var result = misc_1.validateJoiSchema(getSchema(), { url: url });
        this.buildAction({ tag: 'Redirect', text: result.url });
        return this;
    };
    ActionBuilder.prototype.conference = function () {
        this.buildAction({ tag: 'Conference' });
        return this;
    };
    ActionBuilder.prototype.reject = function () {
        this.buildAction({ tag: 'Reject' });
        return this;
    };
    return ActionBuilder;
}());
exports.ActionBuilder = ActionBuilder;
//# sourceMappingURL=actionBuilder.js.map