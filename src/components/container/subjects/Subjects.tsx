import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import CategoryIcon from '@material-ui/icons/Category';
import classes from './Subjects.module.scss';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { Entity, getDocsWithProps, getDocWithId } from '../../../data/Store';
import { ISubject } from '../../../interfaces/ISubject';
import { IExam } from '../../../interfaces/IExam';
import { AppContext } from '../../../App';
import { isTester } from '../../../data/Config';

export const Subjects = () => {
  const { examId } = useParams<any>();
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const keyMap = useBreadcrumb();
  const { email } = useContext(AppContext);

  const fetchData = async () => {
    const exam = await getDocWithId<IExam>(Entity.EXAMS, examId);
    const subjects = await getDocsWithProps<ISubject>(Entity.SUBJECTS, {});
    let filtered = subjects.filter((sub) => exam?.subjectIds?.includes(sub.id));

    // Remove testing lesson from actual users
    if (!isTester(email)) {
      filtered = filtered.filter((sub) => sub.name !== 'Test');
    }

    setSubjects(filtered);
    keyMap(subjects);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="container">
        {
          subjects.map((subject) => (
            <Link
              key={subject.id}
              to={`/${examId}/${subject.id}`}
              style={{ textDecoration: 'none', color: '#5d5d5d' }}
            >
              <div className={classes.card}>
                <CategoryIcon />
                <span className={classes.sub}>{subject.name}</span>
              </div>
            </Link>
          ))
        }
      </div>
    </>
  );
};
