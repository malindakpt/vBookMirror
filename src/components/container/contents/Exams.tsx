import React, { useState, useEffect } from 'react';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { getDocsWithProps } from '../../../data/Store';
import { IExam } from '../../../interfaces/IExam';
import { IBatch } from '../../../interfaces/IBatch';
import { getObject } from '../../../data/StoreHelper';

export const Exams = () => {
  useBreadcrumb();
  const [exams, setExams] = useState<IExam[]>([]);
  // const [batches, setBatches] = useState<IBatch[]>([]);

  useEffect(() => {
    getDocsWithProps<IExam[]>('exams', {}, {}).then((data) => { setExams(data); });
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      {exams?.map((ex) => (
        <Category
          key={ex.id}
          title1={ex.name}
          title2=""
          title3={ex.type}
          navURL={`${ex.id}`}
        />
      )
      )}
    </div>
  );
};
