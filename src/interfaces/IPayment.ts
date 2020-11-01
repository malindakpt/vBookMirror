export interface IPayment {
    id: string;
    date: number;
    amount: number;
    lessonId: string;
    paidFor: string; // for calculating teacher salary
    paymentRef: string;
    paymentObject: any;

    ownerEmail: string;
    ownerName: string;

    status: string;
    disabled?: boolean;
    watchedCount?: number;
}
