export interface IUser {
    id: string;
    lessons: string[];
    payments?: [{
        date: number;
        amount: number;
    }];
    ownerEmail: string;
}
