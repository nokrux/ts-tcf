export interface IChannelListener{
    onChannelOpened(): void;
    onChannelClosed(error: Error): void;
}