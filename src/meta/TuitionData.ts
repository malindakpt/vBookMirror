import {
  IExam, ISubject, ITeacher, ILesson, ICourse,
} from './Interfaces';

export const teachers: ITeacher[] = [
  {
    id: 'T1',
    name: 'Malinda Kumarasinghe',
  }, {
    id: 'T2',
    name: 'Sumudu Herath',
  },
];

export const exams: IExam[] = [
  {
    id: 'AL2020T',
    name: 'Advanced Level',
    batch: '2020 Batch',
    type: 'Theory',
  },
  {
    id: 'AL2020R',
    name: 'Advanced Level',
    batch: '2020 Batch',
    type: 'Revision',
  },
  {
    id: 'AL2021T',
    name: 'Advanced Level',
    batch: '2021 Batch',
    type: 'Theory',
  },
  {
    id: 'AL2021R',
    name: 'Advanced Level',
    batch: '2021 Batch',
    type: 'Revision',
  },
];

export const subjects: ISubject[] = [
  {
    id: 'COMBINDED_MATHS',
    name: 'Combined Maths',
    examIds: ['AL2020T', 'AL2020R', 'AL2021T', 'AL2021R'],
  },

  {
    id: 'BIOLOGY',
    name: 'Biology',
    examIds: ['AL2020T', 'AL2020R', 'AL2021T', 'AL2021R'],
  },

  {
    id: 'PHYSICS',
    name: 'Physics',
    examIds: ['AL2020T', 'AL2020R', 'AL2021T', 'AL2021R'],
  },
  {
    id: 'CHEMISTRY',
    name: 'Chemistry',
    examIds: ['AL2020T', 'AL2020R', 'AL2021T', 'AL2021R'],
  },
];

export const courses: ICourse[] = [
  {
    id: 'C1',
    examId: 'AL2020T',
    subjectId: 'COMBINDED_MATHS',
    teacherId: 'T1',
  },
  {
    id: 'C2',
    examId: 'AL2020R',
    subjectId: 'COMBINDED_MATHS',
    teacherId: 'T2',
  },
];

export const lessons: ILesson[] = [
  {
    id: 'L1',
    courseId: 'C1',
    week: 1,
    videoURL: 'https://www.youtube.com/watch?v=ZIAwhGgFrhA',
    attachments: [],
  }, {
    id: 'L2',
    courseId: 'C1',
    week: 1,
    videoURL: 'https://www.youtube.com/watch?v=ZIAwhGgFrhA',
    attachments: [],
  }, {
    id: 'L3',
    courseId: 'C2',
    week: 1,
    videoURL: 'https://www.youtube.com/watch?v=ZIAwhGgFrhA',
    attachments: [],
  }, {
    id: 'L4',
    courseId: 'C3',
    week: 1,
    videoURL: 'https://www.youtube.com/watch?v=ZIAwhGgFrhA',
    attachments: [],
  },
];
