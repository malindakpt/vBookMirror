import React from 'react';
import { useParams } from 'react-router-dom';
import { getSubjects } from '../../util';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';

interface Props {
  // match?: any;
}
export const Subjects: React.FC<Props> = () => {
  const { examId } = useParams();
  const subjectList = getSubjects(examId);

  return (
    <div className={classes.root}>
      {subjectList.map((subject) => (
        <Category
          key={subject.id}
          title1={subject.name}
          title2={subject.id}
          title3="temp title"
          navURL={`subjects/${subject.id}`}
        />
      ))}
    </div>
  );
};
