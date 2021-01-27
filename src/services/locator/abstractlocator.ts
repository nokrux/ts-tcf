import { EState, IChannel } from "../../channel/ichannel";
import { IPeer } from "../../peer/ipeer";
import { IService } from "../iservice";
import { ILocatorInterface } from "./ilocatorlistener";

export abstract class AbstractLocator implements ILocatorInterface{
    private _name: string = "Locator";
    private _channel: IChannel;

    constructor(channel: IChannel) {
        this._channel = channel;
    }

    hello(): void {
        switch (this._channel.getState()) {
            case EState.CLOSED:
                this._channel.opening();
                break;
            case EState.OPENNING:
                this._channel.open();
                break;
            case EState.OPEN:
                return;
        }
        this._channel.sendEvent(this, 'Hello', ["Breakpoints", "Tool"]);
    }
    peerAdded(peer: IPeer): void {
        throw new Error("Method not implemented.");
    }
    peerChanged(peer: IPeer): void {
        throw new Error("Method not implemented.");
    }
    peerRemoved(peerID: string): void {
        throw new Error("Method not implemented.");
    }
    peerHeartBeat(peerID: string): void {
        throw new Error("Method not implemented.");
    }
    event(name: string, data: any): void {
        switch (name) {
            case "Hello":
                switch (this._channel.getState()) {
                    case EState.CLOSED:
                        this._channel.opening();
                        break;
                    case EState.OPENNING:
                        this._channel.open();
                        break;
                    case EState.OPEN:
                        return;
                }
                break;
        }
    }

    getName(): string {
        return this._name;
    }

}