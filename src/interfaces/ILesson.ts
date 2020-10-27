export interface ILesson {
    id: string;
    topic: string;
    description: string;

    duration: number;
    keywords: string;
    attachments: string[],
    courseId: string;
    price: number;
    ownerEmail: string;
  }

export interface IVideoLesson extends ILesson {
  videoURL: string;
  videoId: string;
}

export interface ILiveLesson extends ILesson {
  meetingId: string;
  dateTime: number;
  pwd: string;
}
