import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { IExam } from '../../../meta/Interfaces';
import { getDocsWithProps } from '../../../data/Store';
import { getExam } from '../../../meta/DataHandler';

export const Subjects = () => {
  const { examId } = useParams();

  const [exams, setExams] = useState<IExam[]>([]);

  useEffect(() => {
    getDocsWithProps('exams', {}, {}).then((data) => { setExams(data); });
  }, []);

  useBreadcrumb();

  return (
    <div className={classes.root}>
      {getExam(exams, examId)?.subjectIds.map((subjectId) => (
        <Category
          key={subjectId}
          title1=""
          title2={subjectId}
          title3=""
          navURL={`${examId}/${subjectId}`}
        />
      ))}
    </div>
  );
};
