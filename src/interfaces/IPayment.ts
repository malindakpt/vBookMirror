import { IBase } from './IBase';
import { LessonType } from './ILesson';

// export enum PaymentType {
//     LIVE_LESSON,
//     VIDEO_LESSON,
//     MCQ_PAPER,
//     TEACHER_SALARY
// }
export interface IPayment extends IBase {
    date: number;
    amount: number;
    lessonId: string;
    paymentType: LessonType;
    paidFor: string; // for calculating teacher salary
    paymentRef: string;
    paymentObject: any;

    ownerEmail: string;
    ownerName: string;

    status: string;
    disabled?: boolean;
    watchedCount?: number;
}
