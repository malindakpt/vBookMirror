import React from 'react';
import { useParams } from 'react-router-dom';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';
import { getSubjects } from '../../../meta/DataHandler';

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
          title1=""
          title2={subject.name}
          title3=""
          navURL={`subjects/${subject.id}`}
        />
      ))}
    </div>
  );
};
