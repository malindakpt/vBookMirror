export interface ILesson {
    id: string;
    topic: string;
    // partNo: string;
    description: string;
    videoURL: string;
    videoId: string;
    keywords: string;
    date: number;
    attachments: string[],
    watchCount: number;
    subCount: number;
    // meta information
    price: number;
    ownerEmail: string;
  }
