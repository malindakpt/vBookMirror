import React, { useState, useEffect, useContext } from 'react';
import {
  Button, Select, MenuItem, InputLabel, FormControl,
} from '@material-ui/core';
import classes from '../ManageCourse.module.scss';
import { addDoc, Entity, getDocsWithProps } from '../../../../data/Store';
import { AppContext } from '../../../../App';
import { ITeacher } from '../../../../interfaces/ITeacher';
import { ISubject } from '../../../../interfaces/ISubject';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import { IExam } from '../../../../interfaces/IExam';
import { ListItems } from '../../../presentational/ListItems/ListItemsComponent';
import { getObject } from '../../../../data/StoreHelper';
import { ICourse } from '../../../../interfaces/ICourse';
import { useForcedUpdate } from '../../../../hooks/useForcedUpdate';

export const AddCourse = () => {
  useBreadcrumb();
  const [busy, setBusy] = useState<boolean>(false);
  const [onUpdate, forceUpdate] = useForcedUpdate();

  const { showSnackbar } = useContext(AppContext);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [exams, setExams] = useState<IExam[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);

  // const [year, setYear] = useState<string>('');

  const [ownerEmail, setOwnerEmail] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [examId, setExamId] = useState('');

  useEffect(() => {
    getDocsWithProps<ITeacher>(Entity.TEACHERS, {}).then((data) => setTeachers(data));
    getDocsWithProps<ISubject>(Entity.SUBJECTS, {}).then((data) => setSubjects(data));
    getDocsWithProps<IExam>(Entity.EXAMS, {}).then((data) => setExams(data));
    getDocsWithProps<ICourse>(Entity.COURSES, {}).then((data) => setCourses(data));
  }, [onUpdate]);

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
      examId,
      examYear: '',
      subjectId,
      ownerEmail,
    };
    addDoc(Entity.COURSES, newCourse).then(() => {
      setCourses((prev) => {
        const clone = [...prev, newCourse];
        return clone;
      });
      showSnackbar(`New course created: ${newCourse.examYear}`);
      setBusy(false);
      forceUpdate();
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
                {`${t.name} ${t.type}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={onSave}
          disabled={disabled || busy}
        >
          Add Course for Teacher
        </Button>
      </form>

      <ListItems list={courses.map((str) => {
        const exam = getObject(exams, str.examId);
        const next = {
          id: str.id,
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
