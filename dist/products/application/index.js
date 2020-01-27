"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fetchApplicationData_1 = require("./fetchApplicationData");
var misc_1 = require("../../utils/misc");
var fetchApplicationData_2 = require("./fetchApplicationData");
exports.fetchApplicationData = fetchApplicationData_2.fetchApplicationData;
exports.APPLICATION = function (credentials) { return ({
    fetchApplicationData: fetchApplicationData_1.fetchApplicationData(credentials),
    get fetchAccount() {
        misc_1.showDeprecationWarning('APPLICATION.fetchAccount()', 'APPLICATION.fetchApplicationData()', 'minor');
        return fetchApplicationData_1.fetchApplicationData(credentials);
    },
}); };
//# sourceMappingURL=index.js.map