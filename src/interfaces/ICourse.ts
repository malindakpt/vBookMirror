import { IBase } from './IBase';

export interface ICourse extends IBase {
    subjectId: string;
    examYear: string;
    examId: string; // TODO try to remve lessons from here
    ownerEmail: string;
}
