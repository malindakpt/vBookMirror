export interface ITeacher {
    id: string;
    name: string;
    phone: string;
    phoneChat: string;
    ownerEmail: string;
    url: string;
    commission: number;
    commissionLive: number;

    zoomMeetingId: string;
    zoomPwd: string;
    zoomMaxCount: number;
    zoomRunningLessonId: string;
    zoomJoinMode: number;
}
