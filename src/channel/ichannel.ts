import { IService } from '../services/iservice'
import { IResult } from '../iresult'
import { IEventListener } from '../event/ieventlistener'

/**
 * IChannel represents communication link connecting two endpoints (peers).
 * The channel asynchroniously transmits messages: commands, results and events.
 * A single channel may be used to communicate with multiple services.
 * Multiple channels may be used to connect the same peers, however no command or event
 * ordering is guaranteed across channels.
 */
export interface IChannel{

    /**
     * @return channel current state
     */
    getState(): EState;

    /**
     * Put channel'state in openning
     */
    opening(): void;

    /**
     * Put channel'state in open
     */
    open(): void;

    /**
     * Sends a TCF command to the remote
     * 
     * @param service TCF service that sends the command
     * @param command name
     * @param args additionnal arguments
     */
    sendCommand(service: IService, command: string, ...args: any[]): Promise<IResult>;

    /**
     * Sends a TCF event
     * 
     * @param service TCF service that sends the event
     * @param event name
     * @param args additionnal arguments
     */
    sendEvent(service: IService, event: string, ...args: any[]): void;

    /**
     * Send the result of a command
     * 
     * @param token 
     * @param type 
     * @param results 
     */
    sendResult(token: number, type: string, ...results: any[]): void;

    /**
     * Adds an event listener on the channel
     * 
     * @param listener listen to event 
     */
    addEventListener(listener: IEventListener):void;
};

export enum EState {
    OPENNING,
    OPEN,
    CLOSED
};