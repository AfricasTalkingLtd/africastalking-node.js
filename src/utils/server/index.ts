import grpc, { Server as GrpcServer } from 'grpc';
import { Credentials } from '../getFullCredentials.types';
import { tokenService } from './tokenService';
import { TokenService } from './tokenService.types';
import { Authenticator, StartOptions } from './index.types';

export class Server {
  private defaultPort = 35897;

  private server: GrpcServer;

  private tokenService: TokenService;

  private authenticator: Authenticator | undefined;


  constructor(credentials: Credentials) {
    this.server = new grpc.Server();
    this.tokenService = tokenService(credentials);
    // TODO: Implement the interceptor
    this.server.addService(this.tokenService.definition, this.tokenService.implementation);
  }

  public addSipCredentials(
    username: string, password: string, host: string, port: number, transport: string,
  ): void {
    this.tokenService.addSipCredentials(username, password, host, port, transport);
  }

  public setAuthenticator(authenticator: Authenticator): void {
    if (!authenticator || typeof authenticator !== 'function') {
      throw new Error('authenticator must be set to a function(client, callback){}');
    }

    this.authenticator = authenticator;
  }

  public start(options: StartOptions): void {
    const {
      certChainFile, privateKeyFile, rootCertFile, port, insecure,
    } = options;
    const bindPort = `0.0.0.0:${port || this.defaultPort}`;

    let credentials = grpc.ServerCredentials.createInsecure();
    if (!insecure) {
      credentials = grpc.ServerCredentials.createSsl(
        rootCertFile,
        [{
          cert_chain: certChainFile,
          private_key: privateKeyFile,
        }],
        false, // check client certificate
      );
    }
    this.server.bind(bindPort, credentials);
    this.server.start();
  }

  public stop() {
    if (this.server) {
      this.server.forceShutdown();
    }
  }
}
