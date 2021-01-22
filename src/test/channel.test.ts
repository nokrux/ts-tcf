import { AbstractChannel } from '../channel/abstractchannel'
import { IService } from '../services/iservice';

class SerialChannel extends AbstractChannel{
    send(message: string): void {
        console.log(message);
    }
    
}

class TestService implements IService{
    getName(): string {
        return "Test";
    }
    
}
const channel = new SerialChannel();
channel.sendCommand(new TestService, "commmandTest", "merde");
channel.sendCommand(new TestService, "commmandTest", {test:1,ola:2}, 2, "5");