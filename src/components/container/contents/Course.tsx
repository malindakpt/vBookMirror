import React from 'react';
import { useParams } from 'react-router-dom';
import { getCourse, getLessons } from '../../../meta/DataHandler';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';

export const Course: React.FC = () => {
  const { courseId } = useParams();
  const course = getCourse(courseId);

  if (!course) { return null; }

  const lessons = getLessons(course.id);
  return (
    <div className={classes.root}>
      {
        lessons.map((lesson) => (
          <Category
            title1={lesson.videoURL}
            navURL="NO"
          />
        ))
      }
    </div>
  );
};
