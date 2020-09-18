import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Card, CardActionArea, CardContent, Typography,
} from '@material-ui/core';
import classes from './Subjects.module.scss';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { getDocsWithProps } from '../../../data/Store';
import { ISubject } from '../../../interfaces/ISubject';

export const Subjects = () => {
  const { year } = useParams<any>();
  const [subjects, setSubjects] = useState<ISubject[]>([]);

  useEffect(() => {
    getDocsWithProps<ISubject[]>('subjects', {}).then((data) => { setSubjects(data); });
  }, []);

  useBreadcrumb();

  return (
    <>
      <div className={classes.root}>
        {
      subjects.map((subject) => (
        <Link
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
                  {subject.name}
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
