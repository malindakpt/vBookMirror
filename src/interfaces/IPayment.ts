import { IBase } from './IBase';

export enum PaymentType {
    LIVE_LESSON,
    VIDEO_LESSON,
    PAPER_LESSON,
    TEACHER_SALARY
}
export interface IPayment extends IBase {
    date: number;
    amount: number;
    lessonId: string;
    paymentType: PaymentType;
    paidFor: string; // for calculating teacher salary
    paymentRef: string;
    paymentObject: any;

    ownerEmail: string;
    ownerName: string;

    status: string;
    disabled?: boolean; // This is mandetory when multiple payments exists and calculate the watch count
    watchedCount?: number;
}
