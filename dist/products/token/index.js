"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createCheckoutToken_1 = require("./createCheckoutToken");
var generateAuthToken_1 = require("./generateAuthToken");
var createCheckoutToken_2 = require("./createCheckoutToken");
exports.createCheckoutToken = createCheckoutToken_2.createCheckoutToken;
var generateAuthToken_2 = require("./generateAuthToken");
exports.generateAuthToken = generateAuthToken_2.generateAuthToken;
exports.TOKEN = function (credentials) { return ({
    createCheckoutToken: createCheckoutToken_1.createCheckoutToken(credentials),
    generateAuthToken: generateAuthToken_1.generateAuthToken(credentials),
}); };
//# sourceMappingURL=index.js.map