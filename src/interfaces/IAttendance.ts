import { IBase } from './IBase';

export interface IAttendance extends IBase {
    ownerEmail: string;
    lessonId: string;
    timestamp: number;
}
