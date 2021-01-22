import { IResult } from "../iresult";
import { IService } from "../services/iservice";
import { EState, IChannel } from "./ichannel";
import { IChannelListener } from "./ichannellistener";
export declare abstract class AbstractChannel implements IChannel {
    private _state;
    private _tokenCounter;
    private _pendingReplies;
    private _pendingCommands;
    constructor();
    abstract send(message: string): void;
    getState(): EState;
    sendCommand: (service: IService, command: string, ...args: any[]) => Promise<IResult>;
    /**
     * Handles reply to a TCF command
     *
     * @param token token of the command
     * @param error if there is an response error
     * @param args reply arguments
     */
    private handleReply;
    sendResult: (token: number, type: string, ...results: any[]) => void;
    addChannelListener(listener: IChannelListener): void;
    removeChannelListener(listener: IChannelListener): void;
    setServiceProxy<TService extends IService>(service: TService, proxy: IService): void;
}
