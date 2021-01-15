import { IService } from '../services/iservice'
import { IToken } from '../itoken'
import { ICommandListener } from '../command/icommandlistener'
import { IChannelListener } from './ichannellistener'

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
     * 
     * @param service - a remote service that will be sent the command
     * @param name - command name
     * @param args - command arguments as string
     * @param done - call back object
     */
    sendCommand(service: IService, name: string, args: string, done: ICommandListener): IToken;
    sendResult(token: IToken, results: string): void;
    addChannelListener(listener: IChannelListener): void;
    removeChannelListener(listener: IChannelListener): void;
    setServiceProxy<TService extends IService>(service: TService, proxy: IService): void;
};

export enum EState {
    OPENNING,
    OPEN,
    CLOSED
};