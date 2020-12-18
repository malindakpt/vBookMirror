import { IBase } from './IBase';
import { LessonType } from './ILesson';

export enum PaymentGateway { // Used by BE
    MANUAL,
    PAY_HERE,
    GEINE
}
export interface IPayment extends IBase {
    date: number;
    amount: number;
    amountPure?: number; // we can get actual price from this for reports
    lessonId: string;
    paymentType: LessonType;
    paidFor: string; // for calculating teacher salary
    paymentRef: string;
    paymentObject: any;

    gateway: PaymentGateway;

    ownerEmail: string;
    ownerName: string;

    status: string;
    disabled?: boolean; // This is mandetory when multiple payments exists and calculate the watch count
    watchedCount?: number;
}
