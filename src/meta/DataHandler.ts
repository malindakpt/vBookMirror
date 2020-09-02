import {
  IExam, ISubject, ICourse, ITeacher,
} from './Interfaces';

export const getExam = (exams: IExam[], examId: string): IExam|null => {
  const filtered = exams.filter((exam) => exam.id === examId);
  return filtered.length > 0 ? filtered[0] : null;
};

export const getCourse = (courses: ICourse[], courseId: string): ICourse|null => {
  const filtered = courses.filter((course) => course.id === courseId);
  return filtered.length > 0 ? filtered[0] : null;
};

export const getTeacher = (teachers: ITeacher[], teacherId: string): ITeacher|null => {
  const filtered = teachers.filter((teacher) => teacher.id === teacherId);
  return filtered.length > 0 ? filtered[0] : null;
};

export const getSubject = (subjects: ISubject[], subjectId: string): ISubject|null => {
  const filtered = subjects.filter((subject) => subject.id === subjectId);
  return filtered.length > 0 ? filtered[0] : null;
};
