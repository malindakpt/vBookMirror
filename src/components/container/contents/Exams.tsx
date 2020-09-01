import React, { useContext } from 'react';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';
import { getExams } from '../../../meta/DataHandler';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { AppContext } from '../../../App';

export const Exams = () => {
  useBreadcrumb();
  // const exams = getExams();
  const { exams } = useContext(AppContext);

  console.log(exams);
  return (
    <div className={classes.root}>
      {exams?.map((ex) => (
        <Category
          key={ex.id}
          title1={ex.name}
          title2={ex.batch}
          title3={ex.type}
          navURL={`${ex.id}`}
        />
      ))}
    </div>
  );
};
