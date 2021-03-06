import React, { useState, useEffect } from 'react';
import SchoolIcon from '@material-ui/icons/School';
import { Category } from '../../presentational/category/Category';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { Entity, getDocsWithProps } from '../../../data/Store';
import { IExam } from '../../../interfaces/IExam';

export const Exams = () => {
  const [exams, setExams] = useState<IExam[]>([]);
  const idMap = useBreadcrumb();
  useEffect(() => {
    getDocsWithProps<IExam>(Entity.EXAMS, {}).then((data) => {
      setExams(data);
      idMap(data);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container">
      {exams.sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0))?.map((ex) => (
        <Category
          key={ex.id}
          title1={`${ex.name}   ${ex.type ?? ''}`}
          CategoryImg={SchoolIcon}
          navURL={`${ex.id}`}
        />
      )
      )}
    </div>
  );
};
