import React from 'react';
import { useParams } from 'react-router-dom';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';
import {
  getCourses, getTeacher, getSubject,
} from '../../../meta/DataHandler';

export const Courses: React.FC = () => {
  const { subjectId, examId } = useParams();
  const coursesList = getCourses(examId, subjectId);

  return (
    <div className={classes.root}>
      {coursesList.map((course) => {
        const teacher = getTeacher(course.teacherId);
        const subject = getSubject(course.subjectId);
        return (
          <Category
            key={course.id}
            title1={subject?.name}
            title2={teacher?.name}
            title3={course.examId}
            navURL={`${subjectId}/${course.id}`}
          />
        );
      })}
    </div>
  );
};
