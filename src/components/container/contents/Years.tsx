import React from 'react';
import { useParams } from 'react-router-dom';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { examYears } from '../../../data/Config';

export const Years = () => {
  const { examId } = useParams<any>();
  const keyMap = useBreadcrumb();
  keyMap(examYears);

  return (
    <div className={classes.root}>
      {examYears?.map((yr) => (
        <Category
          key={yr.id}
          title1={yr.name}
          navURL={`${examId}/${yr.id}`}
        />
      )
      )}
    </div>
  );
};
