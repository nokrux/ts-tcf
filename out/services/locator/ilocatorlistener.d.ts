import { IPeer } from "../../peer/ipeer";
export interface ILocatorInterface {
    peerAdded(peer: IPeer): void;
}
