import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';
import {
  getSubject,
} from '../../../meta/DataHandler';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { getDocsWithProps } from '../../../data/Store';
import { ICourse, ISubject } from '../../../meta/Interfaces';

export const Courses: React.FC = () => {
  useBreadcrumb();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  useEffect(() => {
    getDocsWithProps('courses', {}, {}).then((data: ICourse[]) => setCourses(data));
    getDocsWithProps('subjects', {}, {}).then((data: ISubject[]) => setSubjects(data));
  }, []);
  const { subjectId } = useParams();

  return (
    <div className={classes.root}>
      <h3>Courses</h3>
      {courses.map((course) => {
        const subject = getSubject(subjects, course.subjectId);
        console.log(`${subjectId}/${course.id}`);
        return (
          <Category
            key={course.id}
            title1={course?.teacherId}
            title2={subject?.name}
            title3={course.examId}
            navURL={`${subjectId}/${course.id}`}
          />
        );
      })}
    </div>
  );
};
