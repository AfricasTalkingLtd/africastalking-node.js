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
var misc_1 = require("../../../utils/misc");
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
            Object.keys(attributes).map(function (key) {
                _this.xml += " " + key + "=\"" + attributes[key] + "\"";
                return key;
            });
        }
        if (children) {
            var childrenKeys = Object.keys(children);
            if (((_a = childrenKeys) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                this.xml += '>';
                childrenKeys.map(function (child) {
                    var opts = children[child];
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
        var result = misc_1.validateJoiSchema(getSchema(), __assign(__assign({}, attributes), { text: text }));
        this.buildAction({ tag: 'Say', text: result.text, attributes: result });
    };
    ActionBuilder.prototype.play = function (url) {
        var getSchema = function () { return joi_1.default.object({
            url: joi_1.default.string().uri().required(),
        }).required(); };
        var result = misc_1.validateJoiSchema(getSchema(), { url: url });
        this.buildAction({ tag: 'Play', attributes: result });
    };
    ActionBuilder.prototype.getDigits = function (children, attributes) {
        var getSchema = function () { return joi_1.default.object({
            children: joi_1.default.object({
                say: joi_1.default.any(),
                play: joi_1.default.any(),
            }).required(),
            attributes: joi_1.default.object({
                numDigits: joi_1.default.number().integer(),
                timeout: joi_1.default.number(),
                callbackUrl: joi_1.default.string(),
            }).required(),
        }).required(); };
        var result = misc_1.validateJoiSchema(getSchema(), {
            children: children,
            attributes: attributes,
        });
        this.buildAction(__assign({ tag: 'GetDigits' }, result));
    };
    ActionBuilder.prototype.dial = function (phoneNumbers, attributes) {
        var getSchema = function () { return joi_1.default.object({
            phoneNumbers: joi_1.default.string().required(),
            record: joi_1.default.boolean(),
            sequential: joi_1.default.boolean(),
            callerId: joi_1.default.string().regex(/^\+\d{1,3}\d{3,}$/, 'phone number'),
            ringBackTone: joi_1.default.string().uri(),
            maxDuration: joi_1.default.number(),
        }).required(); };
        var result = misc_1.validateJoiSchema(getSchema(), __assign(__assign({}, attributes), { phoneNumbers: phoneNumbers }));
        this.buildAction({ tag: 'Dial', attributes: result });
    };
    ActionBuilder.prototype.record = function (children, attributes) {
        var getSchema = function () { return joi_1.default.object({
            children: joi_1.default.object({
                say: joi_1.default.any(),
                play: joi_1.default.any(),
            }).required(),
            attributes: joi_1.default.object({
                maxLength: joi_1.default.number(),
                timeout: joi_1.default.number(),
                trimSilence: joi_1.default.boolean(),
                playBeep: joi_1.default.boolean(),
                callbackUrl: joi_1.default.string().uri(),
            }).required(),
        }).required(); };
        var result = misc_1.validateJoiSchema(getSchema(), {
            children: children,
            attributes: attributes,
        });
        this.buildAction(__assign({ tag: 'Record' }, result));
    };
    ActionBuilder.prototype.enqueue = function (attributes) {
        var getSchema = function () { return joi_1.default.object({
            holdMusic: joi_1.default.string().uri(),
        }).required(); };
        var result = misc_1.validateJoiSchema(getSchema(), attributes);
        this.buildAction({ tag: 'Enqueue', attributes: result });
    };
    ActionBuilder.prototype.dequeue = function (phoneNumber, attributes) {
        if (attributes === void 0) { attributes = {}; }
        var getSchema = function () { return joi_1.default.object({
            phoneNumber: joi_1.default.string().regex(/^\+\d{1,3}\d{3,}$/, 'phone number').required(),
        }).required(); };
        var result = misc_1.validateJoiSchema(getSchema(), __assign(__assign({}, attributes), { phoneNumber: phoneNumber }));
        this.buildAction({ tag: 'Dequeue', attributes: result });
    };
    ActionBuilder.prototype.redirect = function (text) {
        var getSchema = function () { return joi_1.default.object({
            text: joi_1.default.string().required(),
        }).required(); };
        var result = misc_1.validateJoiSchema(getSchema(), { text: text });
        this.buildAction({ tag: 'Redirect', text: result.text });
    };
    ActionBuilder.prototype.conference = function () {
        this.buildAction({ tag: 'Conference' });
    };
    ActionBuilder.prototype.reject = function () {
        this.buildAction({ tag: 'Reject' });
    };
    return ActionBuilder;
}());
exports.ActionBuilder = ActionBuilder;
//# sourceMappingURL=actionBuilder.js.map