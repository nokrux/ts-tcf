import { IService } from "../iservice";
export declare abstract class AbstractLocator implements IService {
    private static serviceName;
    getName(): string;
}
