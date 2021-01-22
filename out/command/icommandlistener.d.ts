import { IToken } from "../itoken";
export interface ICommandListener {
    progress(data: string): void;
    result(data: string): void;
    terminated(token: IToken, data: string): void;
}
