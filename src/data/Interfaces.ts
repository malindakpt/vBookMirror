export interface ITeacher {
  id: string;
  name: string;
  email: string;
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
