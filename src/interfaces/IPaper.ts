import { IBase } from './IBase';

export enum PaperType {
  MCQ,
  WRITTEN,
}

export interface IMCQAnswer {
  ans: string;
}

export interface IPaper extends IBase {
  topic: string;
  description: string;
  type: PaperType;
  srcURL: string;
  possibleAnswers: string[];
  asnwers: IMCQAnswer[];
}
