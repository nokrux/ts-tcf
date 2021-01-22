import { IChannel } from "./channel/ichannel";
export interface IChannelOpenListener {
    onChannelOpen(channel: IChannel): void;
}
