"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createCheckoutToken_1 = require("./createCheckoutToken");
var generateAuthToken_1 = require("./generateAuthToken");
exports.token = function (credentials) { return ({
    createCheckoutToken: createCheckoutToken_1.createCheckoutToken(credentials),
    generateAuthToken: generateAuthToken_1.generateAuthToken(credentials),
}); };
//# sourceMappingURL=index.js.map