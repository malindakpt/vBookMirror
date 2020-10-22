import React, { useState, useEffect, useContext } from 'react';
import {
  Button, Select, MenuItem, InputLabel, FormControl, TextField,
} from '@material-ui/core';
import classes from '../ManageCourse.module.scss';
import { addDoc, getDocsWithProps } from '../../../../data/Store';
import { AppContext } from '../../../../App';
import { ITeacher } from '../../../../interfaces/ITeacher';
import { ISubject } from '../../../../interfaces/ISubject';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import { IExam } from '../../../../interfaces/IExam';
import { ListItems } from '../../../presentational/ListItems/ListItemsComponent';
import { getObject } from '../../../../data/StoreHelper';
import { ICourse } from '../../../../interfaces/ICourse';

export const AddCourse = () => {
  useBreadcrumb();
  const [busy, setBusy] = useState<boolean>(false);

  const { showSnackbar } = useContext(AppContext);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [exams, setExams] = useState<IExam[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);

  const [year, setYear] = useState<string>('');

  const [ownerEmail, setOwnerEmail] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [examId, setExamId] = useState('');

  useEffect(() => {
    getDocsWithProps<ITeacher[]>('teachers', {}).then((data) => setTeachers(data));
    getDocsWithProps<ISubject[]>('subjects', {}).then((data) => setSubjects(data));
    getDocsWithProps<IExam[]>('exams', {}).then((data) => setExams(data));
  }, []);

  useEffect(() => {
    getDocsWithProps<ICourse[]>('courses', {}).then((data) => setCourses(data));
  }, [courses]);

  const disabled = !examId || !subjectId || !ownerEmail;

  const onSave = () => {
    for (const c of courses) {
      if (c.ownerEmail === ownerEmail && c.subjectId === subjectId && c.examId === examId) {
        showSnackbar('Course already exists');
        return;
      }
    }

    setBusy(true);
    const newCourse: ICourse = {
      id: '',
      lessons: [],
      examId,
      examYear: year,
      subjectId,
      ownerEmail,
    };
    addDoc('courses', newCourse).then(() => {
      setCourses((prev) => {
        const clone = [...prev, newCourse];
        return clone;
      });
      showSnackbar(`New course created: ${newCourse.examYear}`);
      setBusy(false);
    });
  };

  return (
    <>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        <FormControl className={classes.input}>
          <InputLabel id="select-teacher">Select Teacher</InputLabel>
          <Select
            className={classes.input}
            labelId="label1"
            id="id1"
            value={ownerEmail}
            onChange={(e: any) => {
              setOwnerEmail(e.target.value);
            }}
          >
            {teachers.map((t) => (
              <MenuItem
                value={t.ownerEmail}
                key={t.ownerEmail}
              >
                {`${t.name}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className={classes.input}>
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
        </FormControl>

        <FormControl className={classes.input}>
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
                {`${t.name}-${t.type}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          className={classes.input}
          id="year"
          label="Year"
          onChange={(e) => setYear(e.target.value)}
        />

        <Button
          variant="contained"
          onClick={onSave}
          disabled={disabled || busy}
        >
          Add Course
        </Button>
      </form>

      <ListItems list={courses.map((str) => {
        const exam = getObject(exams, str.examId);
        const next = {
          teacher: getObject(teachers, str.ownerEmail)?.name,
          exam: exam?.name,
          year: str.examYear,
          type: exam?.type,
          subject: getObject(subjects, str.subjectId)?.name,
        };
        return next;
      })}
      />
    </>
  );
};
