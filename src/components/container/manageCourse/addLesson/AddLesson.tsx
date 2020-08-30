import React, { useState } from 'react';
import {
  TextField, Button, Select, MenuItem, InputLabel, FormControl,
} from '@material-ui/core';
import classes from '../ManageCourse.module.scss';
import { addDoc } from '../../../../data/Store';
import { ILesson } from '../../../../meta/Interfaces';
import { getCourses, getSubject, getExam } from '../../../../meta/DataHandler';

export const AddLesson = () => {
  const [lesson, setLesson] = useState<ILesson>();

  const setLessonProp = (obj: any) => {
    setLesson((prev) => {
      const newObj = { ...prev, ...obj };
      return newObj;
    });
  };

  const onSave = () => {
    console.log(lesson);
    if (!lesson || !lesson.courseId || !lesson.videoURL) {
      alert('Invalid inputs');
    } else {
      addDoc('lessons', lesson);
    }
  };

  return (
    <>
      <h3>Manage Courses</h3>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        <FormControl className={classes.input}>
          <InputLabel id="demo-simple-select-label">Select Course</InputLabel>
          <Select
            className={classes.input}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={lesson?.courseId || ''}
            onChange={(e) => setLessonProp({ courseId: e.target.value })}
          >
            {getCourses().map((course) => (
              <MenuItem
                value={course.id}
                key={course.id}
              >
                {`${getSubject(course.subjectId)?.name}-${getExam(course.examId)?.type}-${getExam(course.examId)?.name}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          className={classes.input}
          id="standard-basic"
          label="Video URL"
          onChange={(e) => setLessonProp({ videoURL: e.target.value })}
        />
        <TextField
          className={classes.input}
          id="filled-basic"
          label="Description"
          onChange={(e) => setLessonProp({ description: e.target.value })}
        />
        <Button
          variant="contained"
          onClick={onSave}
        >
          Save
        </Button>
      </form>
    </>
  );
};
