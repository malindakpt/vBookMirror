import React, { useState, useEffect, useContext } from 'react';
import {
  Button, Select, MenuItem, InputLabel, FormControl,
} from '@material-ui/core';
import classes from '../ManageCourse.module.scss';
import { addDoc, getDocsWithProps } from '../../../../data/Store';
import { AppContext } from '../../../../App';
import { ITeacher } from '../../../../interfaces/ITeacher';
import { ISubject } from '../../../../interfaces/ISubject';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import { IExam } from '../../../../interfaces/IExam';
import { IStream } from '../../../../interfaces/IStream';
import { ListItems } from '../../../presentational/ListItems/ListItemsComponent';
import { getObject } from '../../../../data/StoreHelper';

export const AddCourse = () => {
  useBreadcrumb();
  const { showSnackbar } = useContext(AppContext);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [exams, setExams] = useState<IExam[]>([]);
  const [streams, setStreams] = useState<IStream[]>([]);

  const [ownerEmail, setOwnerEmail] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [examId, setExamId] = useState('');

  useEffect(() => {
    getDocsWithProps<ITeacher[]>('teachers', {}).then((data) => setTeachers(data));
    getDocsWithProps<ISubject[]>('subjects', {}).then((data) => setSubjects(data));
    getDocsWithProps<IExam[]>('exams', {}).then((data) => setExams(data));
  }, []);

  useEffect(() => {
    getDocsWithProps<IStream[]>('streams', {}).then((data) => setStreams(data));
  }, [streams]);

  const disabled = !examId || !subjectId || !ownerEmail;

  const onSave = () => {
    const idx = streams.findIndex((str) => str.examId === examId
     && str.subjectId === subjectId && str.ownerEmail === ownerEmail);
    if (idx >= 0) {
      showSnackbar('Course already added for teacher');
      return;
    }
    addDoc<Omit<IStream, 'id'>>('streams', {
      examId,
      subjectId,
      ownerEmail,
    }).then(() => {
      setStreams([]);
      showSnackbar('Course added for teacher');
    });
  };

  return (
    <>
      <h3>Add Stream for Teacher</h3>
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

        <Button
          variant="contained"
          onClick={onSave}
          disabled={disabled}
        >
          Add
        </Button>
      </form>

      <ListItems list={streams.map((str) => {
        const next = {
          teacher: getObject(teachers, str.ownerEmail)?.name,
          exam: getObject(exams, str.examId)?.name,
          subject: getObject(subjects, str.subjectId)?.name,
        };
        return next;
      })}
      />
    </>
  );
};
