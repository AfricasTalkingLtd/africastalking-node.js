const grpc = require('grpc');

const DEFAULT_PORT = 35897;

class ATServer {
    /**
     * 
     * @param {*} options 
     */
    constructor(options) {
        this.tokens = [];

        this.AfricasTalking = require('../index')(options); // eslint-disable-line
        this.server = new grpc.Server();

        this.tokenService = require('./token')(options), // eslint-disable-line
        
        // TODO: Implement the interceptor
        this.server.addService(this.tokenService.definition, this.tokenService.implementation);
    }

    /**
     * 
     * @param {*} username 
     * @param {*} password 
     * @param {*} host 
     * @param {*} port 
     */
    addSipCredentials(username, password, host, port) {
        this.tokenService.addSipCredentials(username, password, host, port);
    }

    /**
     * 
     * @param {*} authenticator 
     */
    setAuthenticator(authenticator) {
        if (!authenticator || typeof authenticator !== 'function') {
            throw new Error('authenticator must be set to a function(client, callback){}');
        }
        this.authenticator = authenticator;
    }

    /**
     * 
     * @param {*} certChainFile 
     * @param {*} privateKeyFile 
     * @param {*} caBundleFile 
     * @param {*} port 
     */
    start(options) {
        const { certChainFile, privateKeyFile, caBundleFile, port, insecure } = options;
        let bindPort = `0.0.0.0:${port || DEFAULT_PORT}`;
        
        let credentials = grpc.ServerCredentials.createInsecure();
        if (!insecure) {
            credentials = grpc.ServerCredentials.createSsl(
                caBundleFile,
                [{
                    cert_chain: certChainFile,
                    private_key: privateKeyFile,
                }],
                false
            );
        } 

        this.server.bind(bindPort || DEFAULT_PORT, credentials);

        if (!this.authenticator) throw new Error('call setAuthenticator() before start()');

        this.server.start();
    }
}

module.exports = ATServer;
