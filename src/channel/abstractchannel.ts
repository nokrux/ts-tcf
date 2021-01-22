import { ICommand } from "../command/icommand";
import { ICommandListener } from "../command/icommandlistener";
import { IResult } from "../iresult";
import { IToken } from "../itoken";
import { Protocol } from "../protocol";
import { IService } from "../services/iservice";
import { EState, IChannel } from "./ichannel";
import { IChannelListener } from "./ichannellistener";

export abstract class AbstractChannel implements IChannel{
    private _state: EState;
    private _tokenCounter: number;
    private _pendingReplies = new Map<number, any[]>();
    private _pendingCommands = new Map<number, ICommand>();

    constructor() { 
        this._state = EState.OPENNING;
        this._tokenCounter = 0;
    }

    abstract send(message:string): void;

    getState(): EState {
        return this._state;
    }

    sendCommand = (service: IService, command: string, ...args: any[]): Promise<IResult> => {
        const self = this;
        const token = this._tokenCounter++;
        
        return new Promise(function (resolve, reject) {
            const timeout = setTimeout(self.handleReply, 5000, token, "timeout 5s", '');
            self._pendingReplies.set(token, [resolve, reject, timeout]);
            self.send(`C${Protocol._nil}${token}${Protocol._nil}${service.getName()}${Protocol._nil}${command}${Protocol._nil}${ Protocol.stringify(args)}${Protocol._eom}`);
        });
    }

    /**
     * Handles reply to a TCF command
     * 
     * @param token token of the command
     * @param error if there is an response error
     * @param args reply arguments
     */
    private handleReply = (token: number, error: string, args: IResult) => {
        if (this._pendingReplies.get(token)) {
            let [resolve, reject, timeout] = this._pendingReplies.get(token);
            this._pendingReplies.delete(token);
            if (error) {
                reject(Error(error));
            }
            else {
                clearTimeout(timeout);
                resolve(args);
            }
        }
    }

    sendResult = (token: number, type: string, ...results: any[]): void => {
        this.send(`${type}${Protocol._nil}${token}${Protocol._nil}${Protocol.stringify(results)}${Protocol._eom}`);
        this._pendingCommands.delete(token);
    }
    
    addChannelListener(listener: IChannelListener): void {
        throw new Error("Method not implemented.");
    }
    removeChannelListener(listener: IChannelListener): void {
        throw new Error("Method not implemented.");
    }
    setServiceProxy<TService extends IService>(service: TService, proxy: IService): void {
        throw new Error("Method not implemented.");
    }
    
}