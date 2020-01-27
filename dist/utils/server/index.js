"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var grpc_1 = __importDefault(require("grpc"));
var tokenService_1 = require("./tokenService");
var Server = (function () {
    function Server(credentials) {
        this.defaultPort = 35897;
        this.server = new grpc_1.default.Server();
        this.tokenService = tokenService_1.tokenService(credentials);
        this.server.addService(this.tokenService.definition, this.tokenService.implementation);
    }
    Server.prototype.addSipCredentials = function (username, password, host, port, transport) {
        this.tokenService.addSipCredentials(username, password, host, port, transport);
    };
    Server.prototype.setAuthenticator = function (authenticator) {
        if (!authenticator || typeof authenticator !== 'function') {
            throw new Error('authenticator must be set to a function(client, callback){}');
        }
        this.authenticator = authenticator;
    };
    Server.prototype.start = function (options) {
        var certChainFile = options.certChainFile, privateKeyFile = options.privateKeyFile, rootCertFile = options.rootCertFile, port = options.port, insecure = options.insecure;
        var bindPort = "0.0.0.0:" + (port || this.defaultPort);
        var credentials = grpc_1.default.ServerCredentials.createInsecure();
        if (!insecure) {
            credentials = grpc_1.default.ServerCredentials.createSsl(rootCertFile, [{
                    cert_chain: certChainFile,
                    private_key: privateKeyFile,
                }], false);
        }
        this.server.bind(bindPort, credentials);
        this.server.start();
    };
    Server.prototype.stop = function () {
        if (this.server) {
            this.server.forceShutdown();
        }
    };
    return Server;
}());
exports.Server = Server;
//# sourceMappingURL=index.js.map