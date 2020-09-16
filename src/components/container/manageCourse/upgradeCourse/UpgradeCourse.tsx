import React, { useState, useEffect, useContext } from 'react';
import {
  Button, Select, MenuItem, InputLabel, FormControl,
} from '@material-ui/core';
import classes from '../ManageCourse.module.scss';
import { addDoc, getDocsWithProps } from '../../../../data/Store';
import { AppContext } from '../../../../App';
import { IExam } from '../../../../interfaces/IExam';
import { ITeacher } from '../../../../interfaces/ITeacher';
import { ISubject } from '../../../../interfaces/ISubject';
import { ICourse } from '../../../../interfaces/ICourse';
import { examYears } from '../../../../data/Config';
import { getObject } from '../../../../data/StoreHelper';

export const UpgradeCourse = () => {
  const { showSnackbar, email, isTeacher } = useContext(AppContext);
  const [exams, setExams] = useState<IExam[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);

  const [teacher, setTeacher] = useState<ITeacher>();
  const [subjectId, setSubjectId] = useState('');
  const [examId, setExamId] = useState('');

  useEffect(() => {
    getDocsWithProps<ITeacher[]>('teachers', { email }, {}).then((data) => {
      const teacher = data[0];
      setTeacher(teacher);
      getDocsWithProps<ICourse[]>('courses', { teacherId: teacher.id }, {}).then((data) => setCourses(data));
    });

    getDocsWithProps<IExam[]>('exams', {}, {}).then((data) => setExams(data));
    getDocsWithProps<ISubject[]>('subjects', {}, {}).then((data) => setSubjects(data));
  }, [email]);

  const createCourse = (course: ICourse, year: string) => {
    const newCourse: ICourse = {
      id: '',
      lessons: course.lessons,
      examId: course.examId,
      examYear: year,
      subjectId: course.subjectId,
      teacherId: course.teacherId,
      disabledLessons: course.lessons,
    };
    addDoc('courses', newCourse).then(() => {
      setCourses((prev) => {
        const clone = [...prev, newCourse];
        return clone;
      });
    });
  };

  const printedCourses: any = {};
  return (
    <>
      <h3>Upgrade Course</h3>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        {
          courses.map((course) => {
            if (printedCourses[`${course.subjectId}-${course.examId}`]) {
              return null;
            }

            printedCourses[`${course.subjectId}-${course.examId}`] = true;
            return examYears.map((year) => {
              const crsForYr = courses.findIndex((c) => c.subjectId === course.subjectId
               && c.examYear === year);

              const courseString = `${getObject(exams, course.examId)?.name}-${getObject(subjects, course.subjectId)?.name}-${year}`;
              if (crsForYr >= 0) {
                return <div key={courseString}>{courseString}</div>;
              }
              return (
                <div key={courseString}>
                  {courseString}
                  <Button onClick={() => createCourse(course, year)}>Enable</Button>
                </div>
              );
            });
          })
        }

        {/* <FormControl className={classes.input}>
          <InputLabel id="select-subject">Select Subject</InputLabel>
          <Select
            className={classes.input}
            labelId="label1"
            id="id1"
            value={subjectId}
            onChange={(e: any) => setSubjectId(e.target.value)}
          >
            {subjects.map((t) => (
              <MenuItem
                value={t.id}
                key={t.id}
              >
                {`${t.name}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}

        {/* <FormControl className={classes.input}>
          <InputLabel id="select-exam">Select Exam</InputLabel>
          <Select
            className={classes.input}
            labelId="label1"
            id="id1"
            value={examId}
            onChange={(e: any) => setExamId(e.target.value)}
          >
            {exams.map((t) => (
              <MenuItem
                value={t.id}
                key={t.id}
              >
                {`${t.name} ${t.batch}  ${t.type}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}

        <Button
          variant="contained"
          // onClick={onSave}
        >
          Add
        </Button>
      </form>
    </>
  );
};
