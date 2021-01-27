import { ICommand } from "../command/icommand";
import { IResult } from "../iresult";
import { IToken } from "../itoken";
import { Protocol } from "../protocol";
import { IService } from "../services/iservice";
import { EState, IChannel } from "./ichannel";
import { EventEmitter } from 'events';
import { ICongestionHandler } from "../icongestionhandler";
import { IEventListener } from "../event/ieventlistener";

export abstract class AbstractChannel extends EventEmitter implements IChannel{

    private _state: EState;
    private _tokenCounter: number;
    private _pendingReplies = new Map<number, IToken>();
    private _pendingCommands = new Map<number, ICommand>();
    private _congestionHandlers = new Array<ICongestionHandler>();

    constructor() {
        super();
        this._state = EState.OPENNING;
        this._tokenCounter = 0;
    }

    abstract send(message: string): void;

    sendEvent(service: IService, event: string, ...args: any[]): void {
        this.send(`E${Protocol._nil}${service}${Protocol._nil}${event}${Protocol._nil}${Protocol.stringify(args)}${Protocol._eom}`);
    }

    getState(): EState {
        return this._state;
    }

    /**
     * 
     * @param service 
     * @param command 
     * @param args 
     */
    sendCommand = (service: IService, command: string, ...args: any[]): Promise<IResult> => {
        const self = this;
        const tokenKey = this._tokenCounter++;
        
        return new Promise(function (resolve, reject) {
            const token: IToken = {
                resolve: resolve,
                reject: reject,
                timeout: setTimeout(self.handleReply, 1000, tokenKey, "timeout 1s", '')
            }
            self._pendingReplies.set(tokenKey, token);
            self.send(`C${Protocol._nil}${tokenKey}${Protocol._nil}${service.getName()}${Protocol._nil}${command}${Protocol._nil}${ Protocol.stringify(args)}${Protocol._eom}`);
        });
    }

    /**
     * Handles reply to a TCF command
     * 
     * @param tokenKey key of the command's token
     * @param error if there is an response error
     * @param args reply arguments
     */
    private handleReply = (tokenKey: number, error: string, args: any) => {
        if (this._pendingReplies.has(tokenKey)) {
            let token = this._pendingReplies.get(tokenKey);
            this._pendingReplies.delete(tokenKey);
            if (error) {
                token.reject(Error(error));
            }
            else {
                clearTimeout(token.timeout);
                token.resolve(args);
            }
        }
    }

    /**
     * Decodes a response to a command message
     * 
     * @param data [<token>, <error_code>, <result_data>]
     */
    private decodeResult(data: string[]): void {
        let token = +data[0];
        let errorReport = data[1];
        let resultData = data[2];
        
        this.handleReply(token, errorReport, JSON.parse(resultData));
    }

    /**
     * Decodes unknown TCF message
     * 
     * @param data unknown data 
     */
    private decodeUnknown(data: string[]): void {
        throw new Error(`Remote don't know the command: ${data}`);
    }

    /**
     * Decodes intermediate result from a progress message
     * 
     * @param data [<token>, <progress_data>]
     */
    private decodeProgress(data: string[]): void {
        const tokenKey = +data[0];
        const token = this._pendingReplies.get(tokenKey);
        token.timeout.refresh();
        let eventData = JSON.parse(data[1]);
        this.emit('progress', +eventData['ProgressComplete'], +eventData['ProgressTotal'], eventData['Description']);
    }

    /**
     * Decodes Flow TCF message
     * 
     * @param data [<traffic_congestion_level>]
     */
    private decodeFlowControl(data: string[]): void {
        let congestion = +(data.shift() as string);

        this._congestionHandlers.forEach(handler => {
            handler.congestion(congestion);
        });
    }

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
    public message = (data: string): void => {
        const self = this;
        let elements = data.split(Protocol._nil);
        
        if (elements.length < 3) {
            throw new Error(`Message has too few parts`);
        }
        if (elements.pop() !== Protocol._eom) {
            throw new Error(`Message has bad termination`);
        }

        // first element of TCF message give the type of the TCF message
        const type = elements.shift();
        switch (type) {
            case 'E':
                self.decodeEvent(elements);
                break;
            case 'P':
                self.decodeProgress(elements);
                break;
            case 'R':
                self.decodeResult(elements);
                break;
            case 'N':
                self.decodeUnknown(elements);
                break;
            case 'F':
                self.decodeFlowControl(elements);
                break;
            default:
                throw (new Error(`Unkown TCF message type: ${type}`));
        }
    }

    /**
     * Decodes TCF event message
     * 
     * @param data [<service>, <event>, <event_data>]
     */
    private decodeEvent(data: string[]): void {
        const service = data.shift() as string;
        const event = data.shift() as string;
        const args = JSON.parse(data.shift());
        if (!this.emit(service, event, args)) {
            throw new Error(`No event listener for ${service}`)
        }
    }

    sendResult = (token: number, type: string, ...results: any[]): void => {
        this.send(`${type}${Protocol._nil}${token}${Protocol._nil}${Protocol.stringify(results)}${Protocol._eom}`);
        this._pendingCommands.delete(token);
    }

    addEventListener(listener: IEventListener) {
        this.on(listener.getName(), listener.event);
    }
}