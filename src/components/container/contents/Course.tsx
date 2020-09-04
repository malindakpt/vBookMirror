import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { getDocsWithProps } from '../../../data/Store';
import { ILesson } from '../../../data/Interfaces';
import { AppContext } from '../../../App';

export const Course: React.FC = () => {
  useBreadcrumb();

  const { email } = useContext(AppContext);
  console.log(email);

  const { courseId } = useParams();
  const [lessons, setLessons] = useState<ILesson[]>();

  useEffect(() => {
    getDocsWithProps('lessons', { courseId }, {}).then((data: ILesson[]) => {
      setLessons(data);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      <h3>
        Course:
      </h3>
      {
        lessons?.map((lesson, idx) => (
          <Category
            key={idx}
            title1={`Week ${idx}`}
            title2={lesson.description}
            title3={lesson.price ? `Rs: ${lesson.price}` : ''}
            navURL="NO"
          />
        ))
      }
    </div>
  );
};
