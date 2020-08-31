import {
  IExam, ISubject, ICourse, ITeacher, ILesson,
} from './Interfaces';
import {
  exams, subjects, courses, teachers,
} from './TuitionData';

export const getSubjects = (examId: string): ISubject[] => {
  const filtered = subjects.filter((subj) => subj.examIds.includes(examId));
  return filtered;
};

export const getCourses = (examId?: string, subjectId?: string): ICourse[] => {
  if (!examId || !subjectId) {
    return courses;
  }
  const filtered = courses.filter((course) => course.examId === examId && course.subjectId === subjectId);
  return filtered;
};

export const getExam = (examId: string): IExam|null => {
  const filtered = exams.filter((exam) => exam.id === examId);
  return filtered.length > 0 ? filtered[0] : null;
};

export const getCourse = (courseId: string): ICourse|null => {
  const filtered = courses.filter((course) => course.id === courseId);
  return filtered.length > 0 ? filtered[0] : null;
};

export const getTeacher = (teacherId: string): ITeacher|null => {
  const filtered = teachers.filter((teacher) => teacher.id === teacherId);
  return filtered.length > 0 ? filtered[0] : null;
};

export const getSubject = (subjectId: string): ISubject|null => {
  const filtered = subjects.filter((subject) => subject.id === subjectId);
  return filtered.length > 0 ? filtered[0] : null;
};

// export const getLessons = (courseId: string): ILesson[] => {
//   const filtered = lessons.filter((lesson) => lesson.courseId === courseId);
//   return filtered;
// };

export const getExams = (): IExam[] => exams;
// for (const lesson of lessons) {
//   const course = getCourse(lesson.courseId);
//   const examOfLessonIdx = exams.findIndex((ex) => ex.id === course?.examId);
//   if (examOfLessonIdx > -1) {
//     exams[examOfLessonIdx].enabled = true;
//   }
// }
// exams;
