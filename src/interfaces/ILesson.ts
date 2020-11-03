import { IBase } from './IBase';

export enum LiveMeetingStatus {
  NOT_STARTED,
  RUNNING,
  FINISHED,
  CANCELLED
}

export interface ILesson extends IBase {
    topic: string;
    description: string;

    duration: number;
    keywords: string;
    attachments: string[],
    courseId: string;
    price: number;
    ownerEmail: string;

    subCount: number;
  }

export interface IVideoLesson extends ILesson {
  videoURL: string;
  videoId: string;
}

export interface ILiveLesson extends ILesson {
  // meetingId: string;
  dateTime: number;
  status: LiveMeetingStatus;
}
