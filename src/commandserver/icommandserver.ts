import { IToken } from "../itoken";

/**
 * Command server interface
 * This interface is to be implemented by service providers.
 */
export interface ICommandServer {
    /**
     * Called every time a command is received from remote peer.
     * @param token - command handle
     * @param name  - command name
     * @param data  - command arguments encoded into string
     */
    command(token: IToken, name: string, data: string): void;
}