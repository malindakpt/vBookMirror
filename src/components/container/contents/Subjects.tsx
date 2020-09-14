import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { getDocsWithProps } from '../../../data/Store';
import { filterId } from '../../../data/StoreHelper';
import { IExam } from '../../../interfaces/IExam';
import { ISubject } from '../../../interfaces/ISubject';

export const Subjects = () => {
  const { examId } = useParams<any>();

  const [exams, setExams] = useState<IExam[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);

  useEffect(() => {
    getDocsWithProps<IExam[]>('exams', {}, {}).then((data) => { setExams(data); });
    getDocsWithProps<ISubject[]>('subjects', {}, {}).then((data) => { setSubjects(data); });
  }, []);

  useBreadcrumb();

  return (
    <div className={classes.root}>
      {filterId(exams, examId)?.subjectIds?.map((subjectId: string) => {
        const subject = filterId(subjects, subjectId);

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
