import { IBase } from './IBase';

export enum LiveMeetingStatus {
  NOT_STARTED,
  RUNNING,
  FINISHED,
  CANCELLED,
}

export enum PaperType {
  MCQ,
  WRITTEN,
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

  // subCount: number;
  type: LessonType
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
  // videoId: string;
}

export interface ILiveLesson extends ILesson {
  // meetingId: string;
  dateTime: number;
  status: LiveMeetingStatus;
  videoUrl?: string;
}
