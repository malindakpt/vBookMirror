import React from 'react';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';
import { getAvailableExams } from '../../../meta/DataHandler';

export const Exams = () => {
  const exams = getAvailableExams();

  return (
    <div className={classes.root}>
      {exams.map((ex) => (
        ex.enabled
        && (
        <Category
          key={ex.id}
          title1={ex.name}
          title2={ex.batch}
          title3={ex.type}
          navURL={`exams/${ex.id}/subjects`}
        />
        )
      ))}
    </div>
  );
};
