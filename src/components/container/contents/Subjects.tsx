import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { AppContext } from '../../../App';

interface Props {
  // match?: any;
}
export const Subjects: React.FC<Props> = () => {
  const { examId } = useParams();
  const { exams = [] } = useContext(AppContext);

  useBreadcrumb();

  return (
    <div className={classes.root}>
      {exams[examId].subjectIds.map((subjectId) => (
        <Category
          key={subjectId}
          title1=""
          title2={subjectId}
          title3=""
          navURL={`${examId}/${subjectId}`}
        />
      ))}
    </div>
  );
};
