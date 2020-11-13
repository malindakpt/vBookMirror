import { IBase } from './IBase';

enum PaperType{
    MCQ, WRITTEN
}

export interface IPaper extends IBase {
    topic: string;
    description: string;
    type: PaperType;
    questions: IMCQQuestion[];
}

export interface IMCQQuestion {
    text: string;
    imageUrl: string;
    answers: {text: string, imgUrl: string, isCorrect: boolean}[]
}
