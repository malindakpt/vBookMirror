export interface IUser {
    id: string;
    // // TODO: Remove watched/expired lessons when its watch for last time
    // videoLessons: {
    //     id: string;
    //     watchedCount: number;
    //     paymentRef: string;
    // }[];
    // // TODO: Remove watched/expired video lessons older than 1 week when another lesson is subscribed
    // liveLessons: {
    //     id: string;
    //     watchedCount: number;
    //     paymentRef: string;
    // }[];
    ownerEmail: string;
}
