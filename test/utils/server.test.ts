import fs from 'fs';
import grpc from 'grpc';
import { expect } from 'chai';
import { Server } from '../../dist';
import { validCredentials } from '../fixtures';

describe('Server', () => {
  const TEST_PORT = 9736;
  const TEST_CLIENT_ID = 'TEST-ID-XXXX';
  const credentials = grpc.credentials.createSsl(fs.readFileSync(`${__dirname}/cert/cert.pem`));
  const sdkProto = grpc.load(
    `${__dirname}/../../src/utils/server/proto/com/africastalking/SdkServerService.proto`,
  ).africastalking;

  let server: Server;

  before('start server', (done) => {
    server = new Server(validCredentials);
    server.addSipCredentials('test', 'secret', 'sip://at.dev', 5060, 'tcp');
    server.setAuthenticator((client, cb) => cb(client === TEST_CLIENT_ID));

    server.start({
      certChainFile: fs.readFileSync(`${__dirname}/cert/cert.pem`),
      privateKeyFile: fs.readFileSync(`${__dirname}/cert/key.pem`),
      rootCertFile: null,
      port: TEST_PORT,
    });

    done();
  });

  after('stop server', (done) => {
    server.stop();
    done();
  });

  it('gives SIP credentials', (done) => {
    const client = new (sdkProto as any).SdkServerService(`localhost:${TEST_PORT}`, credentials);

    client.getSipCredentials({}, (err: Error, result: any) => {
      if (err) {
        done(err);
        return;
      }

      expect(result).to.have.property('credentials');
      expect(result?.credentials?.length).to.equal(1);
      expect(result?.credentials[0]?.username).to.equal('test');
      expect(result?.credentials[0]?.password).to.equal('secret');
      expect(result?.credentials[0]?.host).to.equal('sip://at.dev');
      expect(result?.credentials[0]?.port).to.equal(5060);

      done();
    });
  });

  it('gives auth token', (done) => {
    const client = new (sdkProto as any).SdkServerService(`localhost:${TEST_PORT}`, credentials);

    client.getToken({}, (err: Error, result: any) => {
      if (err) {
        done(err);
        return;
      }

      expect(result).to.have.property('token');
      expect(result).to.have.property('expiration');
      expect(result).to.have.property('username');
      expect(result).to.have.property('environment');
      expect(result?.environment).to.equal('sandbox');

      done();
    });
  });
});
