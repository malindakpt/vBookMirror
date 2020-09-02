import React, { useState, useEffect, useContext } from 'react';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { IExam } from '../../../meta/Interfaces';
import { getDocsWithProps } from '../../../data/Store';
import { AppContext } from '../../../App';

export const Exams = () => {
  useBreadcrumb();
  const [exams, setExams] = useState<IExam[]>([]);

  const { breadcrumbs } = useContext(AppContext);

  console.log(breadcrumbs);
  useEffect(() => {
    getDocsWithProps('exams', {}, {}).then((data) => { setExams(data); });
  }, []);

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
