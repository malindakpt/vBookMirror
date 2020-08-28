import {
  IExam, ISubject, ICourse,
} from './Interfaces';
import {
  exams, subjects, courses, lessons,
} from './TuitionData';

export const getAvailableExams = (): IExam[] => {
  for (const lesson of lessons) {
    const examOfLessonIdx = exams.findIndex((ex) => ex.id === lesson.examId);
    if (examOfLessonIdx > -1) {
      exams[examOfLessonIdx].enabled = true;
    }
  }
  return exams;
};

export const getSubjects = (examId: string): ISubject[] => {
  const filtered = subjects.filter((subj) => subj.examIds.includes(examId));
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
