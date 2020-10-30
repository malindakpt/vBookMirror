export interface IPayment {
    id: string;
    date: number;
    amount: number;
    lessonId: string;
    paidFor: string; // for calculating teacher salary
    ownerEmail: string;
    paymentRef: string;
    paymentObject: string;
}
