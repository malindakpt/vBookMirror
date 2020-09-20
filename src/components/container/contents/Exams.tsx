import React, { useState, useEffect } from 'react';
import SchoolIcon from '@material-ui/icons/School';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { getDocsWithProps } from '../../../data/Store';
import { IExam } from '../../../interfaces/IExam';

export const Exams = () => {
  const [exams, setExams] = useState<IExam[]>([]);
  const idMap = useBreadcrumb();
  useEffect(() => {
    getDocsWithProps<IExam[]>('exams', {}).then((data) => {
      setExams(data);
      idMap(data);
    });
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
          CategoryImg={SchoolIcon}
          navURL={`${ex.id}`}
        />
      )
      )}
    </div>
  );
};
