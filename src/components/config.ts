import {
  IExam, ISubject, ITeacher, ILesson, ICourse,
} from './interfaces';

export const teachers: ITeacher[] = [
  {
    id: 'tid1',
    name: 'Malinda Kumarasinghe',
    subjectIds: ['maths', 'maths2'],
  },
];

export const lessons: ILesson[] = [
  {
    examId: 'AL1',
    batchId: '2020',
    subjectId: 'maths',
    teacherId: '001',
    week: 1,
    videoURL: 'https://www.youtube.com/watch?v=ZIAwhGgFrhA',
    attachments: [],
  }, {
    examId: 'AL2',
    batchId: '2020',
    subjectId: 'maths',
    teacherId: '001',
    week: 1,
    videoURL: 'https://www.youtube.com/watch?v=ZIAwhGgFrhA',
    attachments: [],
  },
];

export const exams: {[id: string]: IExam} = {
  AL1: {
    id: 'AL1',
    name: 'Advanced Level',
    batch: '2020 Batch',
    type: 'Theory',
  },
  AL2: {
    id: 'AL2',
    name: 'Advanced Level',
    batch: '2021 Batch',
    type: 'Revision',
  },
};

export const subjects: ISubject[] = [
  {
    id: 'maths',
    name: 'MAths',
    examId: 'AL1',
  },
  {
    id: 'maths2',
    name: 'MAths2',
    examId: 'AL1',
  },
];

export const courses: ICourse[] = [
  {
    id: 'c0',
    examId: 'AL1',
    subjectId: 'maths',
    teacherId: 'tid1',
    lessons: [],
  },
];

// export const streams = {
//   science: {},
//   commerce: {},
//   art: {},
// };

export const lesson = {
  batchId: '',
  subjectId: '',
  teacherId: '',
  week: '',
  videoURL: '',
  attachments: [],
};
