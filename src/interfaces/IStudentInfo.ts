import { IBase } from './IBase';
import { LessonType } from './ILesson';

export interface IStudentInfo extends IBase {
    name: string;
    ownerEmail: string;
    phone: string;
    birthYear: number;
    reference: string;
    type: LessonType;
}
