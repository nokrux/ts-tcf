export class Protocol {
    private nil: string = '\x00';
    private eom: string = '\x03\x01';

    public sendEvent = (service: string, name: string, data: string) => {
        
    };
}