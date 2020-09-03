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

  const { courseId } = useParams();
  const [lessons, setLessons] = useState<ILesson[]>();

  useEffect(() => {
    getDocsWithProps('lessons', {}, {}).then((data: ILesson[]) => {
      setLessons(data);
    });
  }, []);

  // if (!course) { return null; }

  // const lessons = getLessons(course.id);
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
