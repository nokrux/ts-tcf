import { IService } from '../services/iservice';
import { IChannelListener } from './ichannellistener';
import { IResult } from '../iresult';
/**
 * IChannel represents communication link connecting two endpoints (peers).
 * The channel asynchroniously transmits messages: commands, results and events.
 * A single channel may be used to communicate with multiple services.
 * Multiple channels may be used to connect the same peers, however no command or event
 * ordering is guaranteed across channels.
 */
export interface IChannel {
    /**
     * @return channel current state
     */
    getState(): EState;
    /**
     *
     * @param service - a remote service that will be sent the command
     * @param name - command name
     * @param args - command arguments as string
     * @param done - call back object
     */
    sendCommand(service: IService, command: string, ...args: any[]): Promise<IResult>;
    sendResult(token: number, type: string, ...results: any[]): void;
    addChannelListener(listener: IChannelListener): void;
    removeChannelListener(listener: IChannelListener): void;
    setServiceProxy<TService extends IService>(service: TService, proxy: IService): void;
}
export declare enum EState {
    OPENNING = 0,
    OPEN = 1,
    CLOSED = 2
}
