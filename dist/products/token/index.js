"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generateAuthToken_1 = require("./generateAuthToken");
var createCheckoutToken_1 = require("./createCheckoutToken");
exports.TOKEN = function (credentials) { return ({
    generateAuthToken: generateAuthToken_1.generateAuthToken(credentials),
    createCheckoutToken: createCheckoutToken_1.createCheckoutToken(credentials),
}); };
//# sourceMappingURL=index.js.map