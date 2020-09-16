import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button, makeStyles,
} from '@material-ui/core';
import { Category } from '../../presentational/category/Category';
import classes from './Subjects.module.scss';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { getDocsWithProps } from '../../../data/Store';
import { ISubject } from '../../../interfaces/ISubject';
import back from '../../../images/back1.jpg';

export const Subjects = () => {
  const { year } = useParams<any>();
  const [subjects, setSubjects] = useState<ISubject[]>([]);

  useEffect(() => {
    getDocsWithProps<ISubject[]>('subjects', {}, {}).then((data) => { setSubjects(data); });
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
              {/* <CardMedia
                component="img"
                alt="Contemplative Reptile"
                height="80"
                image={back}
                title="Contemplative Reptile"
                style={{ borderRadius: '0px' }}
              /> */}
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

  // return (
  //   <div className={classes.root}>
  //     {
  //       subjects.map((subject) => (
  //         <Category
  //           key={`${subject.id}`}
  //           title1=""
  //           title2={subject?.name}
  //           title3=""
  //           navURL={`${year}/${subject.id}`}
  //         />
  //       ))
  //     }
  //   </div>
  // );
};
