import React, { useState, useEffect, useContext } from 'react';
import {
  Button, Select, MenuItem, InputLabel, FormControl,
} from '@material-ui/core';
import classes from '../ManageCourse.module.scss';
import { addDoc, getDocsWithProps } from '../../../../data/Store';
import { ITeacher, ISubject, IExam } from '../../../../data/Interfaces';
import { AppContext } from '../../../../App';

export const AddCourse = () => {
  const { showSnackbar } = useContext(AppContext);
  const [exams, setExams] = useState<IExam[]>([]);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);

  const [teacherId, setTeacherId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [examId, setExamId] = useState('');

  useEffect(() => {
    getDocsWithProps('teachers', {}, {}).then((data:ITeacher[]) => setTeachers(data));
    getDocsWithProps('subjects', {}, {}).then((data:ISubject[]) => setSubjects(data));
    getDocsWithProps('exams', {}, {}).then((data:IExam[]) => setExams(data));
  }, []);

  const onSave = () => {
    addDoc('courses', {
      examId,
      subjectId,
      teacherId,
    }).then(() => showSnackbar('Course added'));
  };

  return (
    <>
      <h3>Add Courses</h3>
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
            value={teacherId}
            onChange={(e: any) => setTeacherId(e.target.value)}
          >
            {teachers.map((t) => (
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
                {`${t.name} ${t.batch}  ${t.type}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={onSave}
        >
          Add
        </Button>
      </form>
    </>
  );
};
