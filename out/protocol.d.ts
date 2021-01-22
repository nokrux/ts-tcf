import { IChannelOpenListener } from "./ichannelopenlistener";
export declare class Protocol {
    static _nil: string;
    static _eom: string;
    /**
     *
     * @param service service's name
     * @param name event's name
     * @param data additionnal envent's data
     *
     * Transmit TCF event message.
     * The message is sent to all open communication channels - broadcasted.
     */
    static sendEvent(service: string, name: string, args: any[]): string;
    /**
     * Stringify objects to be send over websocket
     *
     * @param args Objects to stringify
     */
    static stringify(args: any[]): string;
    static addChannelOpenListener(listener: IChannelOpenListener): void;
    static removeChannelOpenListener(listener: IChannelOpenListener): void;
}
