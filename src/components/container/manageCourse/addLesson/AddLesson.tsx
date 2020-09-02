import React, { useState, useEffect, useContext } from 'react';
import {
  TextField, Button, Select, MenuItem, InputLabel, FormControl,
} from '@material-ui/core';
import classes from '../ManageCourse.module.scss';
import { addDoc, getDocsWithProps } from '../../../../data/Store';
import {
  ILesson, ICourse, ITeacher, ISubject, IExam,
} from '../../../../meta/Interfaces';
import { getSubject } from '../../../../meta/DataHandler';
import { AppContext } from '../../../../App';

export const AddLesson = () => {
  const { showSnackbar } = useContext(AppContext);

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [exams, setExams] = useState<IExam[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);

  const [videoURL, setVideoURL] = useState<string>('');
  const [courseId, setCourseId] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    getDocsWithProps('courses', {}, {}).then((data:ICourse[]) => setCourses(data));
    getDocsWithProps('subjects', {}, {}).then((data:ISubject[]) => setSubjects(data));
    getDocsWithProps('exams', {}, {}).then((data:IExam[]) => setExams(data));
    getDocsWithProps('teachers', {}, {}).then((data:ITeacher[]) => setTeachers(data));
  }, []);

  const onSave = () => {
    addDoc('lessons', { courseId, videoURL, description }).then(() => showSnackbar('New lesson added'));
  };

  return (
    <>
      <h3>Add Lesson</h3>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
      >

        <FormControl className={classes.input}>
          <InputLabel id="demo-simple-select-label">Select Course</InputLabel>
          <Select
            className={classes.input}
            labelId="label1"
            id="id1"
            value={courseId}
            onChange={(e: any) => setCourseId(e.target.value)}
          >
            {courses.map((t) => {
              const subject = getSubject(subjects, t.subjectId);
              const teacher = getSubject(teachers, t.teacherId);
              const exam = getSubject(exams, t.examId);

              return (
                <MenuItem
                  value={t.id}
                  key={t.id}
                >
                  {`${exam?.name} ${subject?.name} ${teacher?.name}`}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <TextField
          className={classes.input}
          id="standard-basic"
          label="Video URL"
          value={videoURL}
          onChange={(e) => setVideoURL(e.target.value)}
        />
        <TextField
          className={classes.input}
          id="filled-basic"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
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
