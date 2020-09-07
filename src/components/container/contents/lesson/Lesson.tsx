import { useParams } from 'react-router-dom';
import React from 'react';
import classes from './Lesson.module.scss';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';

export const Lesson: React.FC = () => {
  useBreadcrumb();
  const { lessonId } = useParams();
  return (
    <div className={classes.root}>
      Lesson:
      {lessonId}
    </div>
  );
};
