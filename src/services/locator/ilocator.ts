import { IService } from "../iservice";

export interface ILocator extends IService{
    hello(): void;
}