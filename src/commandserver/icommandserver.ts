import { IToken } from "../itoken";

export interface ICommandServer {
    command(name: IToken, data: string): void;
}