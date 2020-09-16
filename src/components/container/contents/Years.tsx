import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { getDocsWithProps } from '../../../data/Store';
import { IExam } from '../../../interfaces/IExam';
import { examYears } from '../../../data/Config';

export const Years = () => {
  const { examId } = useParams<any>();
  useBreadcrumb();
  // const [exams, setExams] = useState<IExam[]>([]);

  // useEffect(() => {
  //   getDocsWithProps<IExam[]>('exams', {}, {}).then((data) => { setExams(data); });
  //   // eslint-disable-next-line
  // }, []);

  return (
    <div className={classes.root}>
      {examYears?.map((yr) => (
        <Category
          key={yr}
          title1={yr}
          navURL={`${examId}/${yr}`}
        />
      )
      )}
    </div>
  );
};
