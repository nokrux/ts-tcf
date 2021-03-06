import { IChannelOpenListener } from "./ichannelopenlistener";

export class Protocol {
    static _nil: string = '\x00';
    static _eom: string = '\x03\x01';

    // public constructor() { }
    
    /**
     * 
     * @param service service's name
     * @param name event's name
     * @param data additionnal envent's data
     * 
     * Transmit TCF event message.
     * The message is sent to all open communication channels - broadcasted.
     */
    static sendEvent(service: string, name: string, args: any[]) {
        return `E${Protocol._nil}${service}${Protocol._nil}${name}${Protocol._nil}${Protocol.stringify(args)}${Protocol._eom}`;
    };

    /**
     * Stringify objects to be send over websocket
     * 
     * @param args Objects to stringify
     */
    static stringify(args: any[]): string {
        let str = '';
        str = args.map((arg) => {
            return JSON.stringify(arg) + Protocol._nil;
        }).join('');
        return str;
    }

    static addChannelOpenListener(listener: IChannelOpenListener ) {
        
    }

    static removeChannelOpenListener(listener: IChannelOpenListener) {

    }
}