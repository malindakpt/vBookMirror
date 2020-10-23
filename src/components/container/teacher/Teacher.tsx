import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CategoryIcon from '@material-ui/icons/Category';
import { Entity, getDocsWithProps } from '../../../data/Store';
import { getObject } from '../../../data/StoreHelper';
import { ICourse } from '../../../interfaces/ICourse';
import { IExam } from '../../../interfaces/IExam';
import { ISubject } from '../../../interfaces/ISubject';
import { Category } from '../../presentational/category/Category';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { ITeacher } from '../../../interfaces/ITeacher';
import classes from './Teacher.module.scss';

export const Teacher = () => {
  useBreadcrumb();
  const { teacherId } = useParams<any>();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [exams, setExams] = useState<IExam[]>([]);
  const [teacher, setTeacher] = useState<ITeacher| undefined>(undefined);

  useEffect(() => {
    getDocsWithProps<ISubject[]>(Entity.SUBJECTS, {}).then((data) => setSubjects(data));
    getDocsWithProps<IExam[]>(Entity.EXAMS, {}).then((data) => setExams(data));
    getDocsWithProps<ITeacher[]>(Entity.TEACHERS, { shortId: teacherId }).then((data) => {
      if (data.length > 0) {
        const teacher = data[0];
        setTeacher(teacher);
        getDocsWithProps<ICourse[]>(Entity.COURSES, { ownerEmail: teacher.ownerEmail })
          .then((data) => setCourses(data));
      }
    });
  }, [teacherId]);

  return (
    <div className="container">
      {teacher && (
      <div className={classes.name}>
        Courses from
        {` ${teacher?.name}`}
      </div>
      )}
      {
                courses.map((c) => {
                  const subj = getObject(subjects, c.subjectId);
                  const exam = getObject(exams, c.examId);
                  return (
                    <Category
                      key={c.id}
                      title1={`${subj?.name} [${exam?.type}]`}
                      title2={`${exam?.name}`}
                      navURL={`${teacherId}/${c.id}`}
                      CategoryImg={CategoryIcon}
                    />
                  );
                })
            }
    </div>
  );
};
