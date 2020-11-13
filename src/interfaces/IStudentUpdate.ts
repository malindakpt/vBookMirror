import { IBase } from './IBase';

export enum InteractionType {
    LIVE_LESSON,
    VIDEO_LESSON,
    MCQ_PAPER
}
export interface IStudentUpdate extends IBase {
    name: string;
    ownerEmail: string;
    phone: string;
    birthYear: number;
    reference: string;
    type: InteractionType;
}
