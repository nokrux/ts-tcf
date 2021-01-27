import { IEventListener } from "../../event/ieventlistener";
import { IPeer } from "../../peer/ipeer";

export interface ILocatorInterface extends IEventListener{
    hello(): void;
    peerAdded(peer: IPeer): void;
    peerChanged(peer: IPeer): void;
    peerRemoved(peerID: string): void;
    peerHeartBeat(peerID: string): void;
}