import assert = require("assert");
import { AbstractChannel } from "../channel/abstractchannel";
import { IChannel } from "../channel/ichannel";
import { IEventListener } from "../event/ieventlistener";
import { Protocol } from "../protocol";

let eventData: any;
suite('Services Unit Tests', () => {
    let channel: AbstractChannel;
    let testService: TestService;
    setup(() => {
        channel = new SerialChannel();
        testService = new TestService(channel);
        channel.addEventListener(testService);
    });

    suite('Event listener', () => {

        test('Event should be handle', () => {
            channel.message(`E${Protocol._nil}${testService.getName()}${Protocol._nil}testEvent${Protocol._nil}{ "test": "ola" }${Protocol._nil}${Protocol._eom}`)
            assert.deepStrictEqual(eventData, { test: "ola" }, "The event isn't handled correctly");
        });
    });
});

class SerialChannel extends AbstractChannel {
    send(message: string): void {
        throw new Error("Method not implemented.");
    }
}

class TestService implements IEventListener {
    private _channel: IChannel;
    private _name: string = "Test";

    constructor(channel: IChannel) {
        this._channel = channel;
    }
    
    event(name: string, data: any): void {
        switch (name) {
            case 'testEvent':
                eventData = data
                break;
            default:
                throw new Error("Event not implemented.");
        }
    }

    getName(): string {
        return this._name;
    }

    async commmandTest() {
        this._channel.sendCommand(this, "commandTest", { test: "ola" }, { gracias: true }).then((test: any) => {
            console.log(test);
        }).catch((reason: any) => {
            console.log("Réponse avec erreur frere");
        });

    };
}