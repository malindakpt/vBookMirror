import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Card, CardActionArea, CardContent, Typography,
} from '@material-ui/core';
import CategoryIcon from '@material-ui/icons/Category';
import classes from './Subjects.module.scss';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { getDocsWithProps, getDocWithId } from '../../../data/Store';
import { ISubject } from '../../../interfaces/ISubject';
import { IExam } from '../../../interfaces/IExam';

export const Subjects = () => {
  const { year, examId } = useParams<any>();
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const keyMap = useBreadcrumb();

  const fetchData = async () => {
    const exam = await getDocWithId<IExam>('exams', examId);
    const subjects = await getDocsWithProps<ISubject[]>('subjects', {});
    const filtered = subjects.filter((sub) => exam?.subjectIds.includes(sub.id));

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
        {
      subjects.map((subject) => (
        <Link
          key={subject.id}
          to={`${year}/${subject.id}`}
          style={{ textDecoration: 'none', color: '#5d5d5d' }}
        >
          <Card className={classes.card}>
            <CardActionArea>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                >
                  <CategoryIcon />
                  <span className={classes.sub}>{subject.name}</span>
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>
      ))
}
      </div>
    </>
  );
};