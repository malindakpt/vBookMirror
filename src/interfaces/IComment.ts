import { IBase } from './IBase';

export interface IComment extends IBase {
    body: string;
    ownerEmail: string;
}
