import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';
import {
  getSubject, getTeacher, getExam,
} from '../../../data/StoreHelper';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { getDocsWithProps } from '../../../data/Store';
import {
  ICourse, ISubject, ITeacher, IExam,
} from '../../../data/Interfaces';

export const Courses: React.FC = () => {
  const { subjectId, examId } = useParams();

  useBreadcrumb();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [exams, setExams] = useState<IExam[]>([]);

  useEffect(() => {
    getDocsWithProps('courses', { subjectId, examId }, {}).then((data: ICourse[]) => setCourses(data));
    getDocsWithProps('subjects', {}, {}).then((data: ISubject[]) => setSubjects(data));
    getDocsWithProps('teachers', {}, {}).then((data: ITeacher[]) => setTeachers(data));
    getDocsWithProps('exams', {}, {}).then((data: IExam[]) => setExams(data));
  }, []);

  return (
    <div className={classes.root}>
      <h3>Courses</h3>
      {courses.map((course) => {
        const subject = getSubject(subjects, course.subjectId);
        const teacher = getTeacher(teachers, course.teacherId);
        const exam = getExam(exams, course.examId);

        return (
          <Category
            key={course.id}
            title1={teacher?.name}
            title2={subject?.name}
            title3={exam?.name}
            navURL={`${subjectId}/${course.id}`}
          />
        );
      })}
    </div>
  );
};
