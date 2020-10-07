export interface ILesson {
    id: string;
    topic: string;
    // partNo: string;
    description: string;
    videoId: string;
    keywords: string;
    date: number;
    attachments: string[],

    // meta information
    price: number;
    ownerEmail: string;
  }
