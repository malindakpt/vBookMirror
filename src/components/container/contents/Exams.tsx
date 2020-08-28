import React from 'react';
import { getAvailableExams } from '../../util';
import { Category } from '../category/Category';
import classes from './Contents.module.scss';

export const Exams = () => {
  const exams = getAvailableExams();

  return (
    <div className={classes.root}>
      {exams.map((ex) => (
        <Category
          key={ex.id}
          title1={ex.name}
          title2={ex.batch}
          title3={ex.type}
          navURL={`exams/${ex.id}/subjects`}
        />
      ))}
    </div>
  );
};
