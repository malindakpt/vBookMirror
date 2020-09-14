import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';
import { filterId } from '../../../data/StoreHelper';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { getDocsWithProps } from '../../../data/Store';
import { ICourse } from '../../../interfaces/ICourse';
import { ISubject } from '../../../interfaces/ISubject';
import { ITeacher } from '../../../interfaces/ITeacher';
import { IExam } from '../../../interfaces/IExam';

export const Courses: React.FC = () => {
  const { subjectId, examId } = useParams<any>();

  useBreadcrumb();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [exams, setExams] = useState<IExam[]>([]);

  useEffect(() => {
    getDocsWithProps<ICourse[]>('courses', { subjectId, examId }, {}).then((data) => setCourses(data));
    getDocsWithProps<ISubject[]>('subjects', {}, {}).then((data) => setSubjects(data));
    getDocsWithProps<ITeacher[]>('teachers', {}, {}).then((data) => setTeachers(data));
    getDocsWithProps<IExam[]>('exams', {}, {}).then((data) => setExams(data));
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      <h3>Courses</h3>
      {courses.map((course) => {
        const subject = filterId(subjects, course.subjectId);
        const teacher = filterId(teachers, course.teacherId);
        const exam = filterId(exams, course.examId);

        return (
          <Category
            key={course.id}
            title1={teacher?.name}
            title2={subject?.name}
            title3={` ${exam?.year} ${exam?.type} [${exam?.name}]`}
            navURL={`${subjectId}/${course.id}`}
          />
        );
      })}
    </div>
  );
};
