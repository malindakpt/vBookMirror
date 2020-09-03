import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { IExam, ISubject } from '../../../data/Interfaces';
import { getDocsWithProps } from '../../../data/Store';
import { getExam, getSubject } from '../../../data/StoreHelper';
import { ListItems } from '../../presentational/ListItems/ListItemsComponent';

export const Subjects = () => {
  const { examId } = useParams();

  const [exams, setExams] = useState<IExam[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);

  useEffect(() => {
    getDocsWithProps('exams', {}, {}).then((data) => { setExams(data); });
    getDocsWithProps('subjects', {}, {}).then((data) => { setSubjects(data); });
  }, []);

  useBreadcrumb();

  return (
    <div className={classes.root}>
      {getExam(exams, examId)?.subjectIds.map((subjectId) => {
        const subject = getSubject(subjects, subjectId);

        return (

          <Category
            key={subjectId}
            title1=""
            title2={subject?.name}
            title3=""
            navURL={`${examId}/${subjectId}`}
          />

        );
      })}
    </div>
  );
};
