export interface ILesson2 {
    id: string;
    topic: string;
    description: string;

    duration: number;
    keywords: string;
    date: number;
    attachments: string[],
    // watchCount: number;
    // subCount: number;
    // meta information
    courseId: string;
    price: number;
    ownerEmail: string;
    isLive: boolean;
  }

export interface IVideoLesson extends ILesson2 {
  videoURL: string;
  videoId: string;
}

export interface ILiveLesson extends ILesson2 {
  meetingId: string;
  dateTime: number;
  pwd: string;
}
