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
  price: number;
  type: PaperType;
  pdfURL: string;
  pdfId: string;
  possibleAnswers: string[];
  asnwers: IMCQAnswer[];
  ownerEmail: string;
}
