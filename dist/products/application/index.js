"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fetchApplicationData_1 = require("./fetchApplicationData");
exports.APPLICATION = function (credentials) { return ({
    fetchApplicationData: fetchApplicationData_1.fetchApplicationData(credentials),
    fetchAccount: fetchApplicationData_1.fetchApplicationData(credentials),
}); };
//# sourceMappingURL=index.js.map