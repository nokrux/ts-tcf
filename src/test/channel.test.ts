import assert = require('assert');
import { afterEach, teardown } from 'mocha';
import { AbstractChannel } from '../channel/abstractchannel'
import { IChannel } from '../channel/ichannel';
import { Protocol } from '../protocol';
import { IService } from '../services/iservice';

let messageTest: string;

suite('Channel Unit Tests', () => {
    let channel: AbstractChannel;
    let testService: TestService;
    const cmdRegex = new RegExp(`^C${Protocol._nil}[0-9]+${Protocol._nil}[A-Z][a-z]+${Protocol._nil}[a-zA-Z]+${Protocol._nil}.+${Protocol._nil}${Protocol._eom}$`, 'g')
    setup(() => {
        channel = new SerialChannel();
        testService = new TestService(channel);       
    });

    suite('Send command', () => {
        let promise: Promise<any>;
        setup(() => {
            promise = channel.sendCommand(testService, "commandTest", { test: "ola" }, { gracias: true });
        });

        test('Command message should match a specific regex', () => {
            assert.deepStrictEqual(messageTest.search(cmdRegex), 0, "A TCF command must match a particular Regex");
        });

        test('Command without reply return a timeout error after 1s', async () => {
            return promise.catch((reason: Error) => {
                assert.deepStrictEqual(reason.name, 'Error', "Promise rejected with an error");
                assert.deepStrictEqual(reason.message, 'timeout 1s', "Without any response in 1s a timeout clear the command");
            });
        });
    });

    suite('Send command with reply', () => {
        let promise: Promise<any>;
        setup(() => {
            promise = channel.sendCommand(testService, "commandTest", { test: "ola" }, { gracias: true });
        });

        test('Reply should be received', () => {
            promise.then((response:any) => {
                assert.deepStrictEqual(response, { test: "ola" });
            });
            channel.message(`R${Protocol._nil}0${Protocol._nil}${Protocol._nil}{ "test": "ola" }${Protocol._nil}${Protocol._eom}`);
            
        });
        
    });
});

class SerialChannel extends AbstractChannel{
    send(message: string): void {
        messageTest = message;
    }
}

class TestService implements IService{
    private _channel: IChannel;
    private _name: string = "Test";

    constructor(channel: IChannel) {
        this._channel = channel;
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