import { IService } from '../services/iservice'
import { IToken } from '../itoken'
import { ICommandListener } from '../command/icommandlistener'
import { IChannelListener } from './ichannellistener'

export interface IChannel{
    getState(): EState;
    sendCommand(service: IService, name: string, args: string, done: ICommandListener): IToken;
    sendResult(token: IToken, results: string): void;
    addChannelListener(listener: IChannelListener): void;
    removeChannelListener(listener: IChannelListener): void;
};

export enum EState {
    OPENNING,
    OPEN,
    CLOSED
};