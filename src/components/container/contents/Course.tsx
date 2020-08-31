import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCourse } from '../../../meta/DataHandler';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { getDoc, getDocsWithProps } from '../../../data/Store';
import { ILesson } from '../../../meta/Interfaces';

export const Course: React.FC = () => {
  useBreadcrumb();

  const { courseId } = useParams();
  const course = getCourse(courseId);
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
        {courseId}
      </h3>
      {
        lessons?.map((lesson, idx) => (
          <Category
            key={lesson.videoURL}
            title1={`Week ${idx}`}
            title2={lesson.description}
            navURL="NO"
          />
        ))
      }
    </div>
  );
};
