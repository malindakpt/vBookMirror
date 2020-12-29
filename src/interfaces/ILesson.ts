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
  FileVideo,
  EmbedVideo
}

export interface VideoUrlsObj {
  activeVideo: VideoType;
  description: string;
  googleDrive: string;
  fileVideo: string;
  embedVideo: string;
}

export enum LessonType {
  LIVE, VIDEO, PAPER
}

export const emptyVideoObj: VideoUrlsObj = {
  activeVideo: VideoType.None,
  description: '',
  googleDrive: '',
  fileVideo: '',
  embedVideo: '',
};

export interface ILesson extends IBase {
  topic: string;
  description: string;
  orderIndex: number;

  duration: number;
  keywords: string;
  attachments: string[];
  courseId: string;
  price: number;
  ownerEmail: string;

  type: LessonType;
  videoUrls: VideoUrlsObj[];
}

export interface IPaperLesson extends ILesson {
  pdfURL: string;
  pdfId: string;
  possibleAnswers: string[];
  answers: { ans: string }[];
  videoUrl: string;
}

export interface IVideoLesson extends ILesson {
  // Remove this property
  videoURL?: string;
}

export interface ILiveLesson extends ILesson {
  // meetingId: string;
  dateTime: number;
  status: LiveMeetingStatus;
  videoUrl?: string;
  isRunning: boolean;
  // videoUrls: VideoUrlsObj[];
}
