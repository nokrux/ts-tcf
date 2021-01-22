/// <reference types="node" />
import { IResult } from "../iresult";
import { IService } from "../services/iservice";
import { EState, IChannel } from "./ichannel";
import { IChannelListener } from "./ichannellistener";
import { EventEmitter } from 'events';
export declare abstract class AbstractChannel extends EventEmitter implements IChannel {
    private _state;
    private _tokenCounter;
    private _pendingReplies;
    private _pendingCommands;
    private _congestionHandlers;
    constructor();
    abstract send(message: string): void;
    getState(): EState;
    /**
     *
     * @param service
     * @param command
     * @param args
     */
    sendCommand: (service: IService, command: string, ...args: any[]) => Promise<IResult>;
    /**
     * Handles reply to a TCF command
     *
     * @param token token of the command
     * @param error if there is an response error
     * @param args reply arguments
     */
    private handleReply;
    /**
     * Decodes a response to a command message
     *
     * @param data [<token>, <error_code>, <result_data>]
     */
    private decodeResult;
    /**
     * Decodes unknown TCF message
     *
     * @param data unknown data
     */
    private decodeUnknown;
    /**
     * Decodes intermediate result from a progress message
     *
     * @param data [<token>, <progress_data>]
     */
    private decodeProgress;
    /**
     * Decodes Flow TCF message
     *
     * @param data [<traffic_congestion_level>]
     */
    private decodeFlowControl;
    /**
     * Handles TCF message
     *
     * @param data TCF message
     *
     * Command
     *   C • <token> • <service> • <command> • <arguments> • <eom>
     * Progress
     *   P • <token> • <progress_data> • <eom>
     * Result
     *   R • <token> • <result_data> • <eom>
     * Event
     *   E • <service> • <event> • <event_data> • <eom>
     * Flow
     *   F • <traffic_congestion_level> • <eom>
     *
     * • = nil
     * <eom> = eom
     */
    private message;
    /**
     * Decodes TCF event message
     *
     * @param data [<service>, <event>, <event_data>]
     */
    private decodeEvent;
    sendResult: (token: number, type: string, ...results: any[]) => void;
    addChannelListener(listener: IChannelListener): void;
    removeChannelListener(listener: IChannelListener): void;
    setServiceProxy<TService extends IService>(service: TService, proxy: IService): void;
}
