import { Credentials } from '../getFullCredentials.types';
import { Authenticator, StartOptions } from './index.types';
export declare class Server {
    private defaultPort;
    private server;
    private tokenService;
    private authenticator;
    constructor(credentials: Credentials);
    addSipCredentials(username: string, password: string, host: string, port: number, transport: string): void;
    setAuthenticator(authenticator: Authenticator): void;
    start(options: StartOptions): void;
    stop(): void;
}
