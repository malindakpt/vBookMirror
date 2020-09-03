import React, { useState, useEffect, useContext } from 'react';
import {
  TextField, Button, Select, MenuItem, InputLabel, FormControl,
} from '@material-ui/core';
import classes from '../ManageCourse.module.scss';
import { addDoc, getDocsWithProps } from '../../../../data/Store';
import {
  ICourse, ITeacher, ISubject, IExam, ILesson,
} from '../../../../data/Interfaces';
import { getSubject } from '../../../../data/StoreHelper';
import { AppContext } from '../../../../App';
import { ListItems } from '../../../presentational/ListItems/ListItemsComponent';

export const AddLesson = () => {
  const { showSnackbar } = useContext(AppContext);

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [exams, setExams] = useState<IExam[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [lessons, setLessons] = useState<ILesson[]>([]);

  const [videoURL, setVideoURL] = useState<string>('');
  const [courseId, setCourseId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    getDocsWithProps('courses', {}, {}).then((data:ICourse[]) => setCourses(data));
    getDocsWithProps('subjects', {}, {}).then((data:ISubject[]) => setSubjects(data));
    getDocsWithProps('exams', {}, {}).then((data:IExam[]) => setExams(data));
    getDocsWithProps('teachers', {}, {}).then((data:ITeacher[]) => setTeachers(data));
  }, []);

  const onSave = () => {
    addDoc('lessons', {
      courseId, videoURL, description, price,
    }).then(() => showSnackbar('New lesson added'));
  };

  const onCourseChange = (e: any) => {
    const courseId = e.target.value;
    setCourseId(courseId);
    getDocsWithProps('lessons', { courseId }, {}).then((data) => setLessons(data));
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
            onChange={onCourseChange}
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
        <TextField
          className={classes.input}
          id="filled-basic"
          type="number"
          label="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <Button
          variant="contained"
          onClick={onSave}
        >
          Add
        </Button>

      </form>

      <ListItems list={lessons} />
    </>
  );
};
