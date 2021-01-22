"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstractchannel_1 = require("../channel/abstractchannel");
class SerialChannel extends abstractchannel_1.AbstractChannel {
    send(message) {
        console.log(message);
    }
}
class TestService {
    getName() {
        return "Test";
    }
}
const channel = new SerialChannel();
channel.sendCommand(new TestService, "commmandTest", "merde");
channel.sendCommand(new TestService, "commmandTest", { test: 1, ola: 2 }, 2, "5");
