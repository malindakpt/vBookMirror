import { IBase } from './IBase';

export interface IStudentInfo extends IBase {
    name: string;
    ownerEmail: string;
    phone: string;
    birthYear: number;
    reference: string;
}
