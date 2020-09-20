export interface IUser {
    id: string;
    email: string;
    lessons: string[];
    payments?: [{
        date: number;
        amount: number;
    }];
}
