import React from 'react';
import { useParams } from 'react-router-dom';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';
import { getCourses } from '../../../meta/DataHandler';

interface Props {
  // match?: any;
}
export const Courses: React.FC<Props> = () => {
  const { subjectId, examId } = useParams();
  const coursesList = getCourses(examId, subjectId);

  return (
    <div className={classes.root}>
      {coursesList.map((course) => (
        <Category
          key={course.id}
          title1={course.subjectId}
          title2={course.teacherId}
          title3={course.examId}
          navURL={`${subjectId}/${course.id}`}
        />
      ))}
    </div>
  );
};
