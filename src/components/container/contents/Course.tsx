import React from 'react';
import { useParams } from 'react-router-dom';
import { getCourse, getLessons } from '../../../meta/DataHandler';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';

export const Course: React.FC = () => {
  useBreadcrumb();

  const { courseId } = useParams();
  const course = getCourse(courseId);

  if (!course) { return null; }

  const lessons = getLessons(course.id);
  return (
    <div className={classes.root}>
      {
        lessons.map((lesson) => (
          <Category
            key={lesson.videoURL}
            title1={lesson.videoURL}
            navURL="NO"
          />
        ))
      }
    </div>
  );
};
