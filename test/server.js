'use strict';

const fs = require('fs');
const grpc = require('grpc');
const should = require('should');
const validate = require('validate.js');
const fixtures = require('./fixtures.local');

const proto = __dirname + '/../lib/server/proto/com/africastalking/SdkServerService.proto';
const sdk_proto = grpc.load(proto).africastalking;

let server;

describe('Server', function () {
    this.timeout(5000);

    const TEST_PORT = 9736;
    const TEST_CLIENT_ID = "TEST-ID-XXXX";

    const credentials = grpc.credentials.createSsl(fs.readFileSync(__dirname + '/cert/cert.pem'), null, null);

    before(function (done) {
        // starts server
        const Server = require('../server');
        server = new Server(fixtures.TEST_ACCOUNT);
        server.addSipCredentials("test", "secret", "sip://at.dev", 5060, "tcp");
        server.setAuthenticator((client, callback) => callback(client === TEST_CLIENT_ID));

        server.start({
            certChainFile: fs.readFileSync(__dirname + '/cert/cert.pem'),
            privateKeyFile: fs.readFileSync(__dirname + '/cert/key.pem'),
            rootCertFile: null,
            port: TEST_PORT,
        });
        done();
    });

    after(function (done) {
        server.stop();
        done();
    });

    it('gives SIP credentials', function (done) {
        const client = new sdk_proto.SdkServerService(`localhost:${TEST_PORT}`, credentials);

        client.getSipCredentials({}, (err, resp) => {
            if (err) return done(err);
            should(resp).have.property('credentials');
            should(resp.credentials.length).equal(1);
            should(resp.credentials[0].username).equal('test');
            should(resp.credentials[0].password).equal('secret');
            should(resp.credentials[0].host).equal('sip://at.dev');
            should(resp.credentials[0].port).equal(5060);
            done();
        });

    });

    it('gives auth token', function (done) {
        const client = new sdk_proto.SdkServerService(`localhost:${TEST_PORT}`, credentials);
        client.getToken({}, (err, resp) => {
            if (err) return done(err);
            should(resp).have.property('token');
            should(resp).have.property('expiration');
            should(resp).have.property('username');
            should(resp).have.property('environment');
            should(resp.environment).equal('sandbox');
            done();
        });
    });
});
