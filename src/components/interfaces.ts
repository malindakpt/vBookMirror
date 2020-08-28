export interface ITeacher {
  id: string;
  name: string;
  subjectIds: string[];
}

export interface IExam {
  id: string;
  name: string;
  batch: string;
  type: string;
  enabled?: boolean;
}

export interface ISubject {
  id: string;
  name: string;
  examId: string;
}

export const streams = {
  science: {},
  commerce: {},
  art: {},
};

export interface ILesson {
  examId: string;
  batchId: string;
  subjectId: string;
  teacherId: string;
  week: number;
  videoURL: string;
  attachments: [],
}

export interface ICourse {
  id: string;
  subjectId: string;
  examId: string;
  teacherId: string;
  lessons: ILesson[];
}
