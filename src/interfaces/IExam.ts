import { IBase } from "./IBase";

export interface IExam extends IBase {
    name: string;
    type?: string; // special batches/ theory or revison
    subjectIds: string[];
    ownerEmail: string;
}
