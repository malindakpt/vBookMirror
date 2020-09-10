export interface ITeacher {
  id: string;
  name: string;
}

export interface IUser {
  id: string;
  email: string;
  lessons: {
    [id: string]: boolean;
  };
}

export interface IExam {
  id: string;
  name: string;
  batch: string; // Focused year of exam
  type: string; // special batches/ theory or revison
  subjectIds: string[];
}

export interface ISubject {
  id: string;
  name: string;
}

export interface ILesson {
  id: string;
  topic: string;
  partNo: string;
  description: string;
  videoURL: string;
  keywords: string;
  attachments?: [],

  price: number;
}

export interface ICourse {
  id: string;
  subjectId: string;
  examId: string;
  teacherId: string;
  lessons: string[];
}

export interface ISubscription {
  email: string;
  lessonIds: string[]
}
