"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractChannel = void 0;
const protocol_1 = require("../protocol");
const ichannel_1 = require("./ichannel");
class AbstractChannel {
    constructor() {
        this._pendingReplies = new Map();
        this._pendingCommands = new Map();
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
