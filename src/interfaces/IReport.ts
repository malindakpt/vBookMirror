import { IBase } from "./IBase";

export interface IReport extends IBase {
    name: string; 
    marks: number;
    ref: string;
    ownerEmail: string;
}
