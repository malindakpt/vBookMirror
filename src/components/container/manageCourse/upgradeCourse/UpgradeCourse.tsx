import React, { useState, useEffect, useContext } from 'react';
import { Button } from '@material-ui/core';
import classes from '../ManageCourse.module.scss';
import { addDoc, getDocsWithProps } from '../../../../data/Store';
import { AppContext } from '../../../../App';
import { IExam } from '../../../../interfaces/IExam';
import { ITeacher } from '../../../../interfaces/ITeacher';
import { ISubject } from '../../../../interfaces/ISubject';
import { ICourse } from '../../../../interfaces/ICourse';
import { examYears } from '../../../../data/Config';
import { getObject } from '../../../../data/StoreHelper';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import { IStream } from '../../../../interfaces/IStream';

export const UpgradeCourse = () => {
  useBreadcrumb();
  const { showSnackbar, email } = useContext(AppContext);
  const [exams, setExams] = useState<IExam[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [streams, setStreams] = useState<IStream[]>([]);

  useEffect(() => {
    getDocsWithProps<ITeacher[]>('teachers', { email }).then((data) => {
      const teacher = data[0];
      getDocsWithProps<ICourse[]>('courses', { teacherId: teacher.id }).then((data) => setCourses(data));
      getDocsWithProps<IStream[]>('streams',
        { teacherId: teacher.id }).then((data) => setStreams(data));
    });

    getDocsWithProps<IExam[]>('exams', {}).then((data) => setExams(data));
    getDocsWithProps<ISubject[]>('subjects', {}).then((data) => setSubjects(data));
  }, [email]);

  const createCourse = (course: IStream, year: string) => {
    const newCourse: ICourse = {
      id: '',
      lessons: [],
      examId: course.examId,
      examYear: year,
      subjectId: course.subjectId,
      ownerEmail: course.ownerEmail,
    };
    addDoc('courses', newCourse).then(() => {
      setCourses((prev) => {
        const clone = [...prev, newCourse];
        return clone;
      });
      showSnackbar(`New course created: ${newCourse.examYear}`);
    });
  };

  return (
    <>
      <h3>Create Courses</h3>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        {
          streams.map((stream) => examYears.map((year) => {
            const crsForYr = courses.findIndex((c) => c.subjectId === stream.subjectId
               && c.examYear === year.id && c.ownerEmail === stream.ownerEmail && c.examId === stream.examId);

            const exam = getObject(exams, stream.examId);

            const courseString = `${exam?.name}-
                ${getObject(subjects, stream.subjectId)?.name}-${year.name}-${exam?.type}`;

            if (crsForYr >= 0) {
              return <div key={courseString}>{courseString}</div>;
            }

            return (
              <div key={courseString}>
                {courseString}
                <Button onClick={() => createCourse(stream, year.id)}>Create</Button>
              </div>
            );
          }))
        }
      </form>
    </>
  );
};
