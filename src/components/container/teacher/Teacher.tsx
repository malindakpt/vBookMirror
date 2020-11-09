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
import { Banner } from '../../presentational/banner/Banner';

export const Teacher = () => {
  useBreadcrumb();
  const { teacherId } = useParams<any>();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [exams, setExams] = useState<IExam[]>([]);
  const [teacher, setTeacher] = useState<ITeacher| undefined>(undefined);
  const idMap = useBreadcrumb();

  useEffect(() => {
    getDocsWithProps<ISubject[]>(Entity.SUBJECTS, {}).then((data) => {
      setSubjects(data);
      idMap(data);
    });
    getDocsWithProps<IExam[]>(Entity.EXAMS, {}).then((data) => {
      setExams(data);
      idMap(data);
    });
    getDocsWithProps<ITeacher[]>(Entity.TEACHERS, { url: teacherId }).then((data) => {
      idMap(data);
      if (data.length > 0) {
        const teacher = data[0];
        setTeacher(teacher);
        getDocsWithProps<ICourse[]>(Entity.COURSES, { ownerEmail: teacher.ownerEmail })
          .then((data) => {
            idMap(data);
            setCourses(data);
          });
      }
    });
  }, [teacherId, idMap]);

  return (
    <div className={classes.root}>
      {teacher && (
      <div className={classes.teacher}>
        <span className={classes.name}>{` ${teacher?.name}`}</span>
        {/* <span className={classes.phone}>{` ${teacher?.phone}`}</span> */}
        <span className={classes.phone}>{` ${teacher?.ownerEmail}`}</span>
      </div>
      )}

      <div className="container">
        { teacher?.bannerUrl1 && (
        <Banner teacher={teacher} />
      )}
        {courses.length > 0 && (
          courses.map((c) => {
            const subj = getObject(subjects, c.subjectId);
            const exam = getObject(exams, c.examId);
            return (
              <div
                key={c.id}
              >
                <Category
                  title1={`${subj?.name} ${exam?.type}`}
                  title2={`${exam?.name}`}
                  navURL={`${teacherId}/${c.id}`}
                  CategoryImg={CategoryIcon}
                />
              </div>
            );
          })
        ) }
      </div>
    </div>
  );
};
