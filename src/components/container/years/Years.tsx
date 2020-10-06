import React from 'react';
import { useParams } from 'react-router-dom';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { Category } from '../../presentational/category/Category';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { examYears } from '../../../data/Config';

export const Years = () => {
  const { examId } = useParams<any>();
  const keyMap = useBreadcrumb();
  keyMap(examYears);

  return (
    <div className="container">
      {examYears?.map((yr) => (
        <Category
          key={yr.id}
          title1={yr.name}
          CategoryImg={ScheduleIcon}
          navURL={`${examId}/${yr.id}`}
        />
      )
      )}
    </div>
  );
};
