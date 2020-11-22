import { IBase } from './IBase';

export interface ITeacher extends IBase {
    name: string;
    phone: string;
    phoneChat: string;
    ownerEmail: string;
    url: string;
    commissionVideo: number;
    commissionLive: number;

    zoomMeetingId: string;
    zoomPwd: string;
    zoomMaxCount: number;
    zoomRunningLessonId: string;
    zoomJoinMode: number;

    bannerUrl1?: string; // mobile
    bannerUrl2?: string; // desktop
}
