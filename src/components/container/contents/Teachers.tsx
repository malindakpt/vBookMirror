import React from 'react';
import { useParams } from 'react-router-dom';
import { getSubjects, getTeachers } from '../../util';
import { Category } from '../category/Category';
import classes from './Contents.module.scss';

interface Props {
  // match?: any;
}
export const Teacheres: React.FC<Props> = () => {
  const { subjectId } = useParams();
  const teacherList = getTeachers(subjectId);

  return (
    <div className={classes.root}>
      {teacherList.map((teacher) => (
        <Category
          key={teacher.id}
          title1={teacher.name}
          title2={teacher.id}
          title3="teacher title"
          navURL={`${subjectId}`}
        />
      ))}
    </div>
  );
};
