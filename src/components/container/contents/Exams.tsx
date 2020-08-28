import React, { useContext, useEffect } from 'react';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';
import { getAvailableExams } from '../../../meta/DataHandler';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';

export const Exams = () => {
  useBreadcrumb();
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
          navURL={`${ex.id}`}
        />
        )
      ))}
    </div>
  );
};
