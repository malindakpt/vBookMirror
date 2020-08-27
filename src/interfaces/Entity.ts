export interface School {
    name: string;
}

export interface Teacher {
    name: string;
    nic: string;
    mobile: string;
    email: string;
}

export interface Student {
    name: string;
    birthDay: string;
    address: string;
    mobile: string;
    parentInfo: string;
    parentMobile: string;
}

export interface User {
    email: string;
    photoURL: string;
    displayName: string;
    token: string;
}
