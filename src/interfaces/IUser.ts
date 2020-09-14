export interface IUser {
    id: string;
    email: string;
    lessons: {
      [id: string]: boolean;
    };
}
