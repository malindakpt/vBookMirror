import {
  IExam, ISubject, ITeacher, ICourse,
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
    subjectIds: [],
  },
  {
    id: 'AL2020R',
    name: 'Advanced Level',
    batch: '2020 Batch',
    type: 'Revision',
    subjectIds: [],
  },
];

export const subjects: ISubject[] = [
  {
    id: 'COMBINDED_MATHS',
    name: 'Combined Maths',
  },

  {
    id: 'BIOLOGY',
    name: 'Biology',
  },

  {
    id: 'PHYSICS',
    name: 'Physics',
  },
  {
    id: 'CHEMISTRY',
    name: 'Chemistry',
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
    subjectId: 'PHYSICS',
    teacherId: 'T2',
  },
];

// export const lessons: ILesson[] = [
//   {
//     // id: 'L1',
//     courseId: 'C1',
//     // week: 1,
//     videoURL: 'https://www.youtube.com/watch?v=ZIAwhGgFrhA',
//     attachments: [],
//   }, {
//     // id: 'L2',
//     courseId: 'C1',
//     // week: 1,
//     videoURL: 'https://www.youtube.com/watch?v=ZIAwhGgFrhA',
//     attachments: [],
//   }, {
//     // id: 'L3',
//     courseId: 'C2',
//     // week: 1,
//     videoURL: 'https://www.youtube.com/watch?v=ZIAwhGgFrhA',
//     attachments: [],
//   }, {
//     // id: 'L4',
//     courseId: 'C3',
//     // week: 1,
//     videoURL: 'https://www.youtube.com/watch?v=ZIAwhGgFrhA',
//     attachments: [],
//   },
// ];
