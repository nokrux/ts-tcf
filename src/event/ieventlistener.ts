import { IService } from "../services/iservice";

export interface IEventListener extends IService{
    event(name: string, data: any) : void;
}