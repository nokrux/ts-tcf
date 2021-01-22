export interface IEventListener {
    event(name: string, data: any): void;
}
