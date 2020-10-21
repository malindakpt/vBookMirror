import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import CategoryIcon from '@material-ui/icons/Category';
import classes from './Storage.module.scss';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { getDocsWithProps, getDocWithId } from '../../../data/Store';
import { ISubject } from '../../../interfaces/ISubject';
import { IExam } from '../../../interfaces/IExam';

export const Storage = () => {
  const { examId } = useParams<any>();
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const keyMap = useBreadcrumb();

  const fetchData = async () => {
    const exam = await getDocWithId<IExam>('exams', examId);
    const subjects = await getDocsWithProps<ISubject[]>('subjects', {});
    const filtered = subjects.filter((sub) => exam?.subjectIds?.includes(sub.id));

    setSubjects(filtered);
    keyMap(subjects);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className={classes.root}>
        Storage
      </div>
    </>
  );
};
