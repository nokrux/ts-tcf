import { IChannelOpenListener } from "./ichannelopenlistener";

export class Protocol {
    private static _nil: string = '\x00';
    private static _eom: string = '\x03\x01';

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
    static sendEvent(service: string, name: string, data: string) {
        send(`E${Protocol._nil}${service}${Protocol._nil}${name}${Protocol._nil}${data}${Protocol._eom}`)
    };

    static addChannelOpenListener(listener: IChannelOpenListener ) {
        
    }

    static removeChannelOpenListener(listener: IChannelOpenListener) {

    }
}