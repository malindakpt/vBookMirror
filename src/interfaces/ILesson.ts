export interface ILesson {
    id: string;
    topic: string;
    partNo: string;
    description: string;
    videoURL: string;
    keywords: string;
    date: number;
    attachments?: [],

    // meta information
    email: string;
    price: number;
  }
