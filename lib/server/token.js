const _ = require('lodash');
const path = require('path');
const grpc = require('grpc');


const fd = grpc.load(path.join(__dirname, './proto/com/africastalking/SdkServerService.proto'));

let config = null;

const sipCredentials = [];

const getToken = (cxt, callback) => {

    // TODO: Fetch tokens from token server

    callback(null, { token: `${Date.now()}`, expiration: Date.now() });
};

const getSipCredentials = (cxt, callback) => {
    callback(null, { credentials: sipCredentials });
};

module.exports = (params) => {
    config = _.cloneDeep(params);
    return {
        definition: fd.SdkServerService.service,
        implementation: {
            getToken,
            getSipCredentials,
        },

        addSipCredentials: (username, password, host, port = 5060, transport = "udp") => {
            sipCredentials.push({
                username,
                password,
                host,
                port,
                transport,
            });
        },
    };
};
