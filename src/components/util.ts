import {
  IExam, ISubject, ICourse,
} from './interfaces';
import {
  exams, subjects, courses, lessons,
} from './config';

export const getAvailableExams = (): IExam[] => {
  const examList:IExam[] = [];
  for (const lesson of lessons) {
    examList.push(exams[lesson.examId]);
  }
  return examList;
};

export const getSubjects = (examId: string): ISubject[] => {
  const filtered = subjects.filter((subj) => subj.examId === examId);
  return filtered;
};

export const getCourses = (examId: string, subjectId: string): ICourse[] => {
  const filtered = courses.filter((course) => course.examId === examId && course.subjectId === subjectId);
  return filtered;
};

export const getCourse = (courseId: string): ICourse|null => {
  const filtered = courses.filter((course) => course.id === courseId);
  return filtered.length > 0 ? filtered[0] : null;
};
