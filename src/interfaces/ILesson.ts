import { IBase } from './IBase';

export enum LiveMeetingStatus {
  NOT_STARTED,
  RUNNING,
  FINISHED,
  CANCELLED,
}

export enum VideoType {
  None,
  GoogleDrive,
  MediaFire,
}

export interface VideoUrlsObj {
  activeVideo: VideoType;
  googleDrive: string;
  mediaFire: string;
}

export enum LessonType {
  LIVE, VIDEO, PAPER
}

export interface ILesson extends IBase {
  topic: string;
  description: string;

  duration: number;
  keywords: string;
  attachments: string[];
  courseId: string;
  price: number;
  ownerEmail: string;

  type: LessonType;
  videoUrls: VideoUrlsObj;
}

export interface IPaperLesson extends ILesson {
  orderIndex: number;
  pdfURL: string;
  pdfId: string;
  possibleAnswers: string[];
  answers: { ans: string }[];
  videoUrl: string;
}

export interface IVideoLesson extends ILesson {
  videoURL: string;
}

export interface ILiveLesson extends ILesson {
  // meetingId: string;
  dateTime: number;
  status: LiveMeetingStatus;
  videoUrl?: string;
  isRunning: boolean;
}
