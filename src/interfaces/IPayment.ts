export interface IPayment {
    id: string;
    date: number;
    amount: number;
    lessonId: string;
    paidFor: string;
    ownerEmail: string;
}
