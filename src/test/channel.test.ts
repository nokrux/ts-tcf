import { AbstractChannel } from '../channel/abstractchannel'
import { IChannel } from '../channel/ichannel';
import { Protocol } from '../protocol';
import { IService } from '../services/iservice';

class SerialChannel extends AbstractChannel{
    send(message: string): void {
        console.log(message);
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
            console.log(reason);
        });
        
    };
}
const channel = new SerialChannel();
const testService = new TestService(channel);
testService.commmandTest();
channel.message(`R${Protocol._nil}0${Protocol._nil}1${Protocol._nil}${Protocol.stringify([{ test: "ola" }, {walu:"ha"}])}${Protocol._eom}`);
channel.message(`R${Protocol._nil}1${Protocol._nil}${Protocol._nil}${Protocol.stringify([{ test: "ola" }])}${Protocol._eom}`);