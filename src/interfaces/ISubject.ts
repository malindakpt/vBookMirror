import { IBase } from './IBase';

export interface ISubject extends IBase {
    name: string;
    ownerEmail: string;
}
