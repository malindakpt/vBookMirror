export interface ITeacher {
  id: string;
  name: string;
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
  // id: string;
  courseId: string;
  description?: string;
  videoURL: string;
  attachments?: [],
}

export interface ICourse {
  id: string;
  subjectId: string;
  examId: string;
  teacherId: string;
}
