"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractChannel = void 0;
const protocol_1 = require("../protocol");
const ichannel_1 = require("./ichannel");
const events_1 = require("events");
class AbstractChannel extends events_1.EventEmitter {
    constructor() {
        super();
        this._pendingReplies = new Map();
        this._pendingCommands = new Map();
        this._congestionHandlers = new Array();
        /**
         *
         * @param service
         * @param command
         * @param args
         */
        this.sendCommand = (service, command, ...args) => {
            const self = this;
            const token = this._tokenCounter++;
            return new Promise(function (resolve, reject) {
                const timeout = setTimeout(self.handleReply, 5000, token, "timeout 5s", '');
                self._pendingReplies.set(token, [resolve, reject, timeout]);
                self.send(`C${protocol_1.Protocol._nil}${token}${protocol_1.Protocol._nil}${service.getName()}${protocol_1.Protocol._nil}${command}${protocol_1.Protocol._nil}${protocol_1.Protocol.stringify(args)}${protocol_1.Protocol._eom}`);
            });
        };
        /**
         * Handles reply to a TCF command
         *
         * @param token token of the command
         * @param error if there is an response error
         * @param args reply arguments
         */
        this.handleReply = (token, error, args) => {
            if (this._pendingReplies.get(token)) {
                let [resolve, reject, timeout] = this._pendingReplies.get(token);
                this._pendingReplies.delete(token);
                if (error) {
                    reject(Error(error));
                }
                else {
                    clearTimeout(timeout);
                    resolve(args);
                }
            }
        };
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
        this.message = (data) => {
            const self = this;
            let elements = data.split(protocol_1.Protocol._nil);
            if (elements.length < 3) {
                throw new Error(`Message has too few parts`);
            }
            if (elements.pop() !== protocol_1.Protocol._eom) {
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
        };
        this.sendResult = (token, type, ...results) => {
            this.send(`${type}${protocol_1.Protocol._nil}${token}${protocol_1.Protocol._nil}${protocol_1.Protocol.stringify(results)}${protocol_1.Protocol._eom}`);
            this._pendingCommands.delete(token);
        };
        this._state = ichannel_1.EState.OPENNING;
        this._tokenCounter = 0;
    }
    getState() {
        return this._state;
    }
    /**
     * Decodes a response to a command message
     *
     * @param data [<token>, <error_code>, <result_data>]
     */
    decodeResult(data) {
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
    decodeUnknown(data) {
        throw new Error(`Remote don't know the command: ${data}`);
    }
    /**
     * Decodes intermediate result from a progress message
     *
     * @param data [<token>, <progress_data>]
     */
    decodeProgress(data) {
        let token = +data[0];
        let eventData = JSON.parse(data[1]);
        this.emit('progress', +eventData['ProgressComplete'], +eventData['ProgressTotal'], eventData['Description']);
    }
    /**
     * Decodes Flow TCF message
     *
     * @param data [<traffic_congestion_level>]
     */
    decodeFlowControl(data) {
        let congestion = +data.shift();
        this._congestionHandlers.forEach(handler => {
            handler.congestion(congestion);
        });
    }
    /**
     * Decodes TCF event message
     *
     * @param data [<service>, <event>, <event_data>]
     */
    decodeEvent(data) {
        let service = data.shift();
        let event = {
            command: data.shift(),
            args: data
        };
        if (!this.emit(service, event)) {
            throw new Error(`No event listener for ${service}`);
        }
    }
    addChannelListener(listener) {
        throw new Error("Method not implemented.");
    }
    removeChannelListener(listener) {
        throw new Error("Method not implemented.");
    }
    setServiceProxy(service, proxy) {
        throw new Error("Method not implemented.");
    }
}
exports.AbstractChannel = AbstractChannel;
