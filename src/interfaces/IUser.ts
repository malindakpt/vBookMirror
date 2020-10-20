export interface IUser {
    id: string;
    lessons: {
        id: string;
        watchedCount: number;
        paymentRef: string;
    }[];
    ownerEmail: string;
}
