export interface ITeacher {
  id: string;
  name: string;
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
  examIds: string[];
}

export interface ILesson {
  examId: string;
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
}
