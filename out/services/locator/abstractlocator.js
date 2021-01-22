"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractLocator = void 0;
class AbstractLocator {
    getName() {
        return AbstractLocator.serviceName;
    }
}
exports.AbstractLocator = AbstractLocator;
AbstractLocator.serviceName = "Locator";
