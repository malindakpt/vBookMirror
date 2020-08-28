import {
  IExam, ISubject, ITeacher,
} from './interfaces';
import {
  exams, subjects, teachers, lessons,
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

export const getTeachers = (subjectId: string): ITeacher[] => {
  const filtered = teachers.filter((teacher) => teacher.subjectIds.includes(subjectId));
  return filtered;
};
