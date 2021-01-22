"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Protocol = void 0;
class Protocol {
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
    static sendEvent(service, name, args) {
        return `E${Protocol._nil}${service}${Protocol._nil}${name}${Protocol._nil}${Protocol.stringify(args)}${Protocol._eom}`;
    }
    ;
    /**
     * Stringify objects to be send over websocket
     *
     * @param args Objects to stringify
     */
    static stringify(args) {
        let str = '';
        str = args.map((arg) => {
            return JSON.stringify(arg) + Protocol._nil;
        }).join('');
        return str;
    }
    static addChannelOpenListener(listener) {
    }
    static removeChannelOpenListener(listener) {
    }
}
exports.Protocol = Protocol;
Protocol._nil = '\x00';
Protocol._eom = '\x03\x01';
