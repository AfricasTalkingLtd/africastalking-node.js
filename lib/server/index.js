const grpc = require('grpc');

const DEFAULT_PORT = 35897;

class Server {
    /**
     * 
     * @param {*} options 
     */
    constructor(options) {
        this.tokens = [];

        this.AfricasTalking = require('../index')(options); // eslint-disable-line
        this.server = new grpc.Server();

        this.tokenService = require('./tokenService')(options); // eslint-disable-line
        
        // TODO: Implement the interceptor
        this.server.addService(this.tokenService.definition, this.tokenService.implementation);
    }

    /**
     * 
     * @param {*} username 
     * @param {*} password 
     * @param {*} host 
     * @param {*} port 
     * @param {*} transport
     */
    addSipCredentials(username, password, host, port, transport) {
        this.tokenService.addSipCredentials(username, password, host, port, transport);
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
     * @param {*} rootCertFile 
     * @param {*} port
     * @param {*} insecure
     */
    start(options) {
        const { certChainFile, privateKeyFile, rootCertFile, port, insecure } = options;
        const bindPort = `0.0.0.0:${port || DEFAULT_PORT}`;
        
        let credentials = grpc.ServerCredentials.createInsecure();
        if (!insecure) {
            credentials = grpc.ServerCredentials.createSsl(
                rootCertFile,
                [{
                    cert_chain: certChainFile,
                    private_key: privateKeyFile,
                }],
                false // check client certificate
            );
        } 

        this.server.bind(bindPort || DEFAULT_PORT, credentials);
        this.server.start();
    }

    /**
     * 
     */
    stop() {
        if (this.server) {
            this.server.forceShutdown();
        }
    }
}

module.exports = Server;
