import { IService } from "../iservice";

export abstract class AbstractLocator implements IService{
    private static serviceName: string = "Locator";
    
    getName(): string {
        return AbstractLocator.serviceName;
    }

}