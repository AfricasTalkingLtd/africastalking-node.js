"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = __importDefault(require("joi"));
var body_parser_1 = __importDefault(require("body-parser"));
var misc_1 = require("../../utils/misc");
exports.expressHandler = function (handler) { return [
    body_parser_1.default.urlencoded({ extended: true }),
    body_parser_1.default.json(),
    function (req, res, next) {
        var body = req.body;
        handler(body, function (options) {
            var getSchema = function () { return joi_1.default.object({
                response: joi_1.default.string().required(),
                endSession: joi_1.default.boolean().required(),
            }).required(); };
            try {
                var result = misc_1.validateJoiSchema(getSchema(), options);
                res
                    .contentType('text/plain')
                    .status(200)
                    .send((result.endSession ? 'END' : 'CON') + " " + result.response);
            }
            catch (err) {
                next(err);
            }
        });
    },
]; };
//# sourceMappingURL=expressHandler.js.map